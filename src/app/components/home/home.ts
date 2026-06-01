import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { catchError, combineLatest, filter, Observable, of, take } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { SubjectService } from '../../services/subject.service';
import { UserService } from '../../services/user.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { AssignmentDTO } from '../../models/dto/assignmentDTO';
import { Subject } from '../../models/subject.model';
import { Topic } from '../../models/topic.model';
import { TopicService } from '../../services/topic.service';
import { ClassroomService } from '../../services/classroom.service';
import { Assignment } from '../../models/assignment.model';
import { Notice } from '../../models/notice.model';
import { NoticeService } from '../../services/notice.service';
import { DateEvent } from '../../models/date-event.model';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  pendingAssignments$!: Observable<AssignmentDTO[]>;
  studentList$!: Observable<User[]>;

  professorSubjects$!: Observable<Subject[]>;
  selectedSubjectId: string = '';

  lastActivity$!: Observable<Topic>;
  lastActivityVisited!: Topic & { classroomId: string };
  lastActivitySubject$!: Observable<Subject>;
  lastActivityAssignment$!: Observable<Assignment>;
  activityTime!: any;

  noticeList$!: Observable<Notice[]>;

  currentUser$!: Observable<User>;

  dateList$!: Observable<DateEvent[]>;

  private readonly SUBJECT_KEY = 'cursitu_selected_subject';

  constructor(
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private noticeService: NoticeService,
    private dateService: DateService,
    private classroomService: ClassroomService,
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue!;
    this.currentUser$ = this.userService.getUserById(user.id!);

    const topicId = this.topicService.getTopicFromStorage();

    this.activityTime = this.topicService.getTopicTimeFromStorage();

    this.getNoticeList();
    this.loadLastActivityVisited(topicId!);
    this.loadDateList();

    if (user.role === 'ALUMNO') {
      this.loadPendingAssignments();
    }

    if (user.role === 'ADMIN') {
      this.router.navigate(['/user-management']);
    }

    if (user.role === 'DOCENTE') {
      this.loadProfessorSubjects();
    }
  }

  loadLastActivityVisited(topicId: string) {
    if (topicId == null) return;

    // ===XX PROBLEMA AQUI XX===
    this.lastActivity$ = this.topicService.getTopicById(topicId!);

    this.lastActivity$.subscribe({
      next: (topic) => {
        this.lastActivityVisited = {
          ...topic,
          classroomId: topic.classroom_id!,
        };

        this.loadLastActivityAssignment(topic.assignmentId!);

        this.classroomService.getClassroomById(topic.classroom_id).subscribe({
          next: (classroom) => {
            this.loadActivitySubject(classroom.subject_id!);
            this.cdr.detectChanges();
          },
          error: (err) =>
            console.error(
              'Hubo un problema al buscar el curso relativo a la ultima actividad: ',
              err,
            ),
        });
      },
    });
  }

  loadActivitySubject(id: string) {
    this.lastActivitySubject$ = this.subjectService.getSubjectById(id).pipe(
      tap((subject: Subject) => {
        document.documentElement.style.setProperty('--subject-color', subject.color);
      }),
    );
  }

  loadLastActivityAssignment(id: string) {
    this.lastActivityAssignment$ = this.assignmentService.getAssignmentById(id);
  }

  loadProfessorSubjects() {
    this.currentUser$.subscribe({
      next: (user) => {
        this.professorSubjects$ = this.subjectService.getProfessorSubjects(user.id!);
        this.initSubjectAutoSelection();
      },
    });
  }

  initSubjectAutoSelection(): void {
    this.professorSubjects$
      .pipe(
        filter((subjects) => subjects && subjects.length > 0),
        take(1),
      )
      .subscribe((subjects) => {
        const firstSubjectId = subjects[0].id;
        this.selectedSubjectId = firstSubjectId!;

        this.cdr.detectChanges();

        this.loadStudentsBySubject(firstSubjectId!);
      });
  }

  getNoticeList() {
    this.noticeList$ = this.noticeService.getNotReadNotices(this.authService.currentUserValue?.id!);
  }

  goToNotice(noticeId: string) {
    this.router.navigate(['/notices', noticeId]);
  }

  onSubjectChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.selectedSubjectId = element.value;
    this.loadStudentsBySubject(this.selectedSubjectId);
  }

  loadStudentsBySubject(subjectId: string) {
    this.subjectService.getSubjectById(subjectId).subscribe({
      next: (subject) => {
        this.studentList$ = this.classroomService.getStudentsInClassroom(subject.classroom_id!);
        this.cdr.detectChanges();
      },
      error: (err) =>
        console.error('Hubo un problema al obtener la materia para la lista de alumnos: ', err),
    });
  }

  loadPendingAssignments() {
    this.pendingAssignments$ = this.assignmentService.getPendingAssignments(
      this.authService.currentUserValue?.id!,
    );
  }

  goToActivity(path: string, subjectId: string): void {
    localStorage.setItem(this.SUBJECT_KEY, subjectId);
    this.router.navigate([path]);
  }

  loadDateList() {
    this.dateList$ = this.dateService.getAllDateEvents();
  }

  formatDate(original: Date | string): string {
    const date = new Date(original);

    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    let formattedDate = formatter.format(date);

    formattedDate = formattedDate.replace(/,/g, '');
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    formattedDate = formattedDate.replace(/\./g, '').toUpperCase();

    return formattedDate;
  }

  translateDayToSpanish(day: string): string {
    const translations: { [key: string]: string } = {
      MONDAY: 'Lunes',
      TUESDAY: 'Martes',
      WEDNESDAY: 'Miércoles',
      THURSDAY: 'Jueves',
      FRIDAY: 'Viernes',
      SATURDAY: 'Sábado',
      SUNDAY: 'Domingo',
    };
    return translations[day.toUpperCase()] || day;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
