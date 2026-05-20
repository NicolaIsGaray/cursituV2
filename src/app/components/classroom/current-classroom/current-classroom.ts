import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject.model';
import { Topic } from '../../../models/topic.model';
import {
  BehaviorSubject,
  catchError,
  forkJoin,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { TopicService } from '../../../services/topic.service';
import { Assignment } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';

@Component({
  selector: 'app-classroom',
  imports: [CommonModule, RouterModule],
  templateUrl: './current-classroom.html',
  styleUrl: './current-classroom.css',
})
export class CurrentClassroom implements OnInit {
  classroomId: string | null = null;
  subject?: Subject;
  classroom?: Classroom;

  // Los Observables que consumirá el HTML directamente
  topicsList$!: Observable<Topic[]>;
  assignedActivity$: Observable<Assignment | null> = of(null);

  private selectedTopicSubject = new BehaviorSubject<Topic | null>(null);
  selectedTopic$ = this.selectedTopicSubject.asObservable();

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private subjectService: SubjectService,
    private assignmentService: AssignmentService,
    private topicService: TopicService,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('id');

    if (!this.classroomId) {
      console.error('No se ha encontrado el ID del curso.');
      return;
    }

    // FLUJO UNIFICADO: Vinculamos la carga del Aula, Materia y Temas en una sola cadena reactiva
    this.topicsList$ = this.classroomService.getClassroomById(this.classroomId).pipe(
      take(1),
      tap((classroomData) => {
        this.classroom = classroomData;
      }),
      // Una vez obtenida el aula, buscamos la materia asociada
      switchMap((classroomData) => {
        if (!classroomData?.subject_id) return of(null);
        return this.subjectService.getSubjectById(classroomData.subject_id).pipe(take(1));
      }),
      tap((subjectData) => {
        if (subjectData) {
          this.subject = subjectData;
        }
      }),
      // Una vez que tenemos la materia y el aula en memoria, resolvemos sus temas individuales
      switchMap(() => {
        const ids = this.classroom?.topics_id || [];
        if (ids.length === 0) {
          console.warn('No hay temas cargados en este curso. Activando estado de bienvenida.');
          this.selectedTopicSubject.next(null);
          return of([]);
        }

        const requests = ids.map((id) => this.topicService.getTopicById(id).pipe(take(1)));
        return forkJoin(requests);
      }),
      // Cuando el forkJoin emita la lista de temas completa:
      tap((topics) => {
        if (topics.length > 0 && !this.selectedTopicSubject.value) {
          this.seleccionarTema(topics[0]);
        }
        // Avisamos a Angular de manera explícita que los datos están listos para pintar
        this.cdr.detectChanges();
      }),
      catchError((err) => {
        console.error('Error crítico en la cadena de carga del Classroom: ', err);
        return of([]);
      }),
      // Compartimos el flujo para que el HTML no repita las peticiones HTTP internas
      shareReplay(1),
    );

    // Flujo de actividades dependiente del tema seleccionado (Se mantiene reactivo)
    this.assignedActivity$ = this.selectedTopicSubject.asObservable().pipe(
      switchMap((topic: Topic | null) => {
        if (!topic || !topic.assignment_id) {
          return of(null);
        }
        return this.assignmentService.getAssignmentById(topic.assignment_id).pipe(
          catchError((err) => {
            console.error('Hubo un error al obtener la actividad asignada: ', err);
            return of(null);
          }),
        );
      }),
      tap(() => this.cdr.detectChanges()), // Fuerza actualización al cambiar de actividad
    );
  }

  seleccionarTema(topic: Topic) {
    this.selectedTopicSubject.next(topic);
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
    return formattedDate.replace(/\./g, '').toUpperCase();
  }

  goBack() {
    this.location.back();
  }
}
