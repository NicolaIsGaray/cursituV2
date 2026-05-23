import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClassroomService } from '../../../services/classroom.service';
import { BehaviorSubject, catchError, Observable, of, switchMap, take, tap } from 'rxjs';
import { TopicService } from '../../../services/topic.service';
import { AssignmentService } from '../../../services/assignment.service';
import { ClassroomDTO } from '../../../models/dto/classroomDTO';
import { SubjectService } from '../../../services/subject.service';

@Component({
  selector: 'app-classroom',
  imports: [CommonModule, RouterModule],
  templateUrl: './current-classroom.html',
  styleUrl: './current-classroom.css',
})
export class CurrentClassroom implements OnInit {
  classroomId: string | null = null;
  subjectColor: string = '#4f46e5';

  classroomData$!: Observable<ClassroomDTO | null>;
  assignedActivity$: Observable<any | null> = of(null);

  private selectedTopicSubject = new BehaviorSubject<any | null>(null);
  selectedTopic$ = this.selectedTopicSubject.asObservable();

  private readonly TOPIC_KEY = 'cursitu_selected_topic';
  private readonly SUBJECT_KEY = 'cursitu_selected_subject';

  constructor(
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private classroomService: ClassroomService,
    private assignmentService: AssignmentService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private cdr: ChangeDetectorRef,
    private location: Location,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.classroomId = this.activatedRoute.snapshot.paramMap.get('id');

    if (!this.classroomId) {
      console.error('No se ha encontrado el ID del curso.');
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadClassroomData();
  }

  loadClassroomData() {
    this.subjectService.getSubjectById(localStorage.getItem(this.SUBJECT_KEY)!.replace(/"/g, '')).subscribe({
      next: (subject) => {
        this.subjectColor = subject.color
        this.cdr.detectChanges();
      },
      error: (err) => console.error("Hubo un problema al obtener la materia: ", err)
    })
    this.classroomData$ = this.classroomService.obtainClassroomActivities(this.classroomId!).pipe(
      take(1),
      tap((data: ClassroomDTO) => {
        if (data && data.topics.length > 0) {
          const savedTopicId = localStorage.getItem(this.TOPIC_KEY)?.replace(/"/g, '');
          const targetTopic = data.topics.find((t) => t.id === savedTopicId) || data.topics[0];
          this.selectTopic(targetTopic);
        } else {
          localStorage.setItem(this.TOPIC_KEY, '');
        }
      }),
      catchError((err) => {
        console.error('Error crítico al recuperar los datos agregados del curso:', err);
        return of(null);
      }),
    );

    this.assignedActivity$ = this.selectedTopic$.pipe(
      switchMap((topic) => {
        if (!topic || !topic.assignmentId) {
          return of(null);
        }
        return this.assignmentService.getAssignmentById(topic.assignmentId).pipe(
          catchError((err) => {
            console.error(`Error 404 o red al buscar la asignación ${topic.assignmentId}:`, err);
            return of(null);
          }),
        );
      }),
      tap(() => this.cdr.detectChanges()),
    );
  }

  selectTopic(topic: any) {
    this.selectedTopicSubject.next(topic);
    localStorage.setItem(this.TOPIC_KEY, topic.id);
  }

  formatDate(original: Date | string): string {
    if (!original) return 'SIN FECHA';
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
    return formattedDate.replace(/\./g, '').toUpperCase();
  }

  deleteCurrentTopic(classId: string) {
    const currentTopic = this.selectedTopicSubject.value;
    if (!currentTopic) return;

    const confirmation = confirm(
      `Vas a eliminar esta clase permanentemente, incluyendo actividad y materiales subidos. ¿Proceder?`,
    );

    if (confirmation) {
      this.topicService.deleteTopic(currentTopic.id).subscribe({
        next: () => {
          alert('Clase Eliminada Exitosamente.');
          localStorage.setItem(this.TOPIC_KEY, '');
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/current-classroom', classId]);
          });
        },
        error: (err) => console.error('Hubo un problema al intentar eliminar la clase: ', err),
      });
    }
  }

  managementMode(mode: 'crear' | 'editar') {
    localStorage.setItem('class_mode', mode);
  }

  goBack() {
    this.location.back();
  }
}
