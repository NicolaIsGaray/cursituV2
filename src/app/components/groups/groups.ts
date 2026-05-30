import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of, take, tap } from 'rxjs';
import { Subject } from '../../models/subject.model';
import { Group } from '../../models/group.model';
import { SubjectService } from '../../services/subject.service';
import { GroupService } from '../../services/group.service';
import { User } from '../../models/user.model';
import { ClassroomService } from '../../services/classroom.service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupDTO } from '../../models/dto/groupDTO';

@Component({
  selector: 'app-groups',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups implements OnInit {
  mode: 'crear' | 'editar' = 'crear';

  professorSubjects$!: Observable<Subject[]>;
  studentSubjects$!: Observable<Subject[]>;
  selectedSubject!: Subject;

  groupList$!: Observable<Group[]>;
  studentGroups$!: Observable<GroupDTO[] | null>;
  groupForm!: FormGroup;
  groupToEditId!: string;

  studentList$!: Observable<User[]>;
  rawStudents: User[] = [];

  userData!: User;

  constructor(
    public authService: AuthService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private classroomService: ClassroomService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.currentUserValue!;

    if (this.userData.role === 'ALUMNO') {
      this.getStudentSubjects();
    }

    if (this.userData.role === 'DOCENTE') {
      this.getProfessorSubjects();
      this.initForm();
    }
  }

  getStudentSubjects() {
    this.studentSubjects$ = this.subjectService.getStudentSubjects(this.userData.id!);

    this.studentSubjects$.subscribe({
      next: (subjects) => {
        this.selectedSubject = subjects[0];
        this.showStudentGroups(this.selectedSubject.id!);
      },
      error: () => console.warn('No se pudo seleccionar la materia automaticamente.'),
    });
  }

  switchGroupSubject(subjectId: string) {
    this.subjectService.getSubjectById(subjectId).subscribe({
      next: (subject) => {
        this.selectedSubject = subject;

        document.documentElement.style.setProperty('--subject-color', subject.color);
        this.showStudentGroups(subject.id!);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Hubo un problema al intentar obtener la materia: ', err),
    });
  }

  showStudentGroups(subjectId: string) {
    this.studentGroups$ = this.groupService
      .getCurrentStudentGroups(this.userData.id!, subjectId)
      .pipe(
        catchError((error) => {
          if (error.status === 404) {
            console.log('El alumno no pertenece a ningún grupo en esta materia.');
          } else {
            console.error('Hubo un error inesperado en el servidor:', error);
          }
          return of(null);
        }),
      );
  }

  initForm() {
    this.groupForm = this.fb.group({
      groupNumber: ['', Validators.required],
      groupLimit: ['', Validators.required],
      groupMembers: this.fb.array([]),
    });
  }

  get studentFormArray(): FormArray {
    return this.groupForm.get('groupMembers') as FormArray;
  }

  private loadStudentsWithoutGroup(classroomId: string): void {
    this.studentList$ = this.classroomService.getStudentsInClassroom(classroomId);

    this.groupList$.pipe(take(1)).subscribe({
      next: (currentGroups: Group[]) => {
        const occupiedStudentIds = new Set<string>();
        currentGroups.forEach((group) => {
          if (group.membersId) {
            group.membersId.forEach((id) => occupiedStudentIds.add(String(id)));
          }
        });

        this.studentList$.subscribe({
          next: (students: User[]) => {
            this.rawStudents = students.filter((student) => {
              const isOccupiedInThisSubject = occupiedStudentIds.has(String(student.id));

              if (this.mode === 'crear') {
                return !isOccupiedInThisSubject;
              }

              return !isOccupiedInThisSubject;
            });

            this.studentFormArray.clear();
            this.rawStudents.forEach(() => {
              this.studentFormArray.push(
                this.fb.group({
                  selected: [false],
                }),
              );
            });

            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error al recuperar alumnos del aula:', err),
        });
      },
      error: (err) => console.error('Error al recuperar los grupos para el filtro:', err),
    });
  }

  getProfessorSubjects(): void {
    this.professorSubjects$ = this.subjectService.getProfessorSubjects(this.userData.id!);

    this.professorSubjects$.pipe(take(1)).subscribe({
      next: (subjects) => {
        if (subjects && subjects.length > 0) {
          this.selectProfessorSubject(subjects[0]);
        }
      },
      error: (err) => console.error('Error al cargar materias del docente:', err),
    });
  }

  loadGroupSubjects(id: string) {
    this.groupList$ = this.groupService.getGroupsInSubject(id).pipe(
      catchError((err) => {
        console.warn('No se encontraron grupos o la materia está vacía:', err);
        return of([]);
      }),
    );
  }

  selectProfessorSubject(subject: Subject) {
    this.mode = 'crear';
    this.selectedSubject = subject;

    document.documentElement.style.setProperty('--subject-color', subject.color);
    this.groupForm.reset();

    this.loadGroupSubjects(subject.id!);
    this.loadStudentsWithoutGroup(subject.classroom_id!);

    this.cdr.detectChanges();
  }

  onSubmitGroup(): void {
    if (this.groupForm.invalid) return;

    const formValues = this.studentFormArray.value;

    const selectedStudentIds: string[] = this.rawStudents
      .filter((_, index) => formValues[index].selected)
      .map((student) => student.id!);

    const payload: Group = {
      membersId: selectedStudentIds,
      number: this.groupForm.value.groupNumber,
      group_limit: this.groupForm.value.groupLimit,
      subjectId: this.selectedSubject.id!,
      professor_id: this.selectedSubject.professor_id,
      classroom_id: this.selectedSubject.classroom_id!,
    };

    if (this.mode === 'crear') {
      this.groupService.createGroup(payload).subscribe({
        next: () => {
          alert('Grupo Creado Exitosamente.');
          this.refreshData();
        },
        error: (err) => console.error('Hubo un problema al intentar crear el grupo: ', err),
      });
    } else if (this.mode === 'editar') {
      this.groupService.updateGroup(this.groupToEditId, payload).subscribe({
        next: () => {
          alert('Grupo Actualizado Exitosamente.');
          this.mode = 'crear';
          this.refreshData();
        },
        error: (err) => console.error('Hubo un problema al actualizar el grupo: ', err),
      });
    }
  }

  editGroup(group: Group) {
    this.mode = 'editar';
    this.groupToEditId = group.id!;

    this.groupForm.patchValue({
      groupNumber: group.number,
      groupLimit: group.group_limit,
    });

    this.studentList$.subscribe({
      next: (students: User[]) => {
        this.rawStudents = students;
        this.studentFormArray.clear();

        this.rawStudents.forEach((student) => {
          const isMember = group.membersId.includes(student.id!);
          this.studentFormArray.push(
            this.fb.group({
              selected: [isMember],
            }),
          );
        });

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al recuperar alumnos del aula:', err),
    });
  }

  deleteGroup(group: Group) {
    const confirmation = confirm(
      `Estás a punto de eliminar al Grupo N° ${group.number} ¿Proceder?`,
    );

    if (confirmation) {
      this.groupService.deleteGroup(group.id!).subscribe({
        next: () => {
          alert('Grupo Eliminado Exitosamente.');
          this.refreshData();
        },
        error: (err) => console.error('Hubo un problema al intentar eliminar el grupo: ', err),
      });
    }
  }

  cancelEdit(): void {
    this.mode = 'crear';
    this.refreshData();
  }

  private refreshData(): void {
    this.groupForm.reset();
    if (this.selectedSubject) {
      this.loadGroupSubjects(this.selectedSubject.id!);
      this.loadStudentsWithoutGroup(this.selectedSubject.classroom_id!);
    }
  }

  validateKeyboard(event: KeyboardEvent): void {
    if (['+', '-'].includes(event.key)) {
      event.preventDefault();
      return;
    }

    const input = event.target as HTMLInputElement;
    if (
      input.value.length >= 2 &&
      !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)
    ) {
      event.preventDefault();
    }
  }

  goBack() {
    this.location.back();
  }
}
