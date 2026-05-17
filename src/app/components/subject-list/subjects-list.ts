import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';
import { Observable, combineLatest, filter, forkJoin, map, of, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-subjects',
  imports: [CommonModule, RouterModule],
  templateUrl: './subjects-list.html',
  styleUrls: ['./subjects-list.css'],
})
export class SubjectsList implements OnInit {
  subjectList$!: Observable<Subject[]>;
  professorList$!: Observable<User[]>;
  subjectsWithProfessor$!: Observable<any[]>;

  studentSubjectList$?: Observable<Subject[]>;

  constructor(
    private router: Router,
    public authService: AuthService,
    private subjectService: SubjectService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    if (this.authService.currentUser$ && this.authService.currentUserValue?.role === 'ALUMNO' || 'DOCENTE') {
      this.loadUserSubjects();
    } else {
      this.obtainProfessorInSubjects();
    }
  }

  loadUserSubjects() {
    const ids = this.authService.currentUserValue?.subjects_id;

    if (ids && ids.length > 0) {
      const requests = ids.map((id) =>
        this.subjectService.getSubjectById(id).pipe(
          switchMap((subject) =>
            this.userService.getUserById(subject.professor_id).pipe(
              // UNIFICACIÓN: Mapeamos para estructurar 'professorName' igual que el otro flujo
              map((prof) => ({
                ...subject,
                professorName: prof ? prof.name : 'Sin asignar',
              })),
            ),
          ),
        ),
      );
      // Asignamos el flujo combinado a la misma variable que usará el HTML
      this.subjectsWithProfessor$ = forkJoin(requests);
    } else {
      // Si el alumno no tiene materias, usamos la lógica por defecto de buscar todos
      this.obtainProfessorInSubjects();
    }
  }

  obtainProfessorInSubjects() {
    const role = 'DOCENTE';

    this.professorList$ = this.userService
      .allUsers()
      .pipe(map((users) => users.filter((u) => u.role === role)));

    this.subjectList$ = this.subjectService.getAllSubjects();

    this.subjectsWithProfessor$ = combineLatest([this.subjectList$, this.professorList$]).pipe(
      map(([subjects, professors]) => {
        return subjects.map((subject) => {
          // CORRECCIÓN: Se debe comparar contra subject.professor_id, no contra subject.id
          const assignedProfessor = professors.find((p) => p.id === subject.professor_id);
          return {
            ...subject,
            professorName: assignedProfessor ? assignedProfessor.name : 'Sin asignar',
          };
        });
      }),
    );
  }

  navigateToClassroom(path: string, subjectId: string) {
    this.router.navigate([path, subjectId]);
  }

  navigateToPanel(path: string) {
    this.router.navigate([path]);
  }
}
