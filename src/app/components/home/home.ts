import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { catchError, combineLatest, filter, Observable, of, take } from 'rxjs';
import { AssignmentService } from '../../services/assignment.service';
import { SubjectService } from '../../services/subject.service';
import { UserService } from '../../services/user.service';
import { map, switchMap } from 'rxjs/operators';
import { AssignmentDTO } from '../../models/dto/assignmentDTO';
import { Subject } from '../../models/subject.model';

interface HomeOption {
  title: string;
  icon: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  pendingAssignments$!: Observable<any[]>;
  studentList$!: Observable<User[]>;
  options: HomeOption[] = [
    {
      title: 'Materias',
      icon: 'book',
      description: 'Gestiona tus asignaturas y contenidos.',
      route: '/subjects',
    },
    {
      title: 'Grupos',
      icon: 'groups',
      description: 'Colabora con tus compañeros de estudio.',
      route: '/groups',
    },
    {
      title: 'Curso',
      icon: 'school',
      description: 'Información general de tu cursado.',
      route: '/classroom',
    },
    {
      title: 'Notificaciones',
      icon: 'notifications',
      description: 'Revisa las últimas novedades.',
      route: '/notifications',
    },
    {
      title: 'Tareas Pendientes',
      icon: 'assignment',
      description: 'Organiza tus entregas.',
      route: '/pending-tasks',
    },
  ];

  constructor(
    private router: Router,
    public authService: AuthService,
    private userService: UserService,
    private assignmentService: AssignmentService,
    private subjectService: SubjectService,
  ) {}

  ngOnInit(): void {
    this.authService.getAuthStatus();
    this.loadAssignmentsWithSubjectNames();
  }

  loadAssignmentsWithSubjectNames() {
    this.pendingAssignments$ = this.authService.currentUser$.pipe(
      filter((user) => !!user),
      take(1),
      switchMap((user) => {
        // 1. Combinamos ambas peticiones HTTP
        return combineLatest([
          this.assignmentService.getPendingAssignments(user.id!),
          this.subjectService.getAllSubjects(),
        ]).pipe(
          // Tipamos la desestructuración del array que viene de combineLatest
          map(([assignments, subjects]: [AssignmentDTO[], Subject[]]) => {
            // 2. Creamos el mapa con tipo estricto <string, string>
            const subjectMap = new Map<string, string>(
              subjects.map((s: any) => [s.id, s.subject_name]), // <-- 's' ahora está tipado
            );

            // 3. Mapeamos las actividades inyectando el nombre de la materia
            return assignments.map((activity: any) => ({
              // <-- 'activity' ahora está tipado
              ...activity,
              subjectNameResolved: subjectMap.get(activity.subject_id) || 'Materia No Asignada',
            }));
          }),
        );
      }),
      catchError((err) => {
        console.error('Error al cruzar actividades con materias en el front:', err);
        return of([]);
      }),
    );
  }

  goToActivity(activityId: string): void {
    this.router.navigate(['/send-task', activityId]);
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
