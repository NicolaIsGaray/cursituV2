import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject } from '../../../models/subject.model';
import { forkJoin, map, Observable, of, switchMap, take } from 'rxjs';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { SubjectService } from '../../../services/subject.service';
import { UserService } from '../../../services/user.service';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';
import { AssignmentService } from '../../../services/assignment.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-subject-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subject-management.html',
  styleUrl: './subject-management.css',
})
export class SubjectManagement implements OnInit {
  modo: 'crear' | 'editar' | 'eliminar' | null = null;

  subjectForm!: FormGroup;
  newSubject: Subject = new Subject();
  subjectToUpdateId: string | null = null;
  subjectToDeleteSel!: Subject;
  subjectList$!: Observable<Subject[]>;

  professorList$!: Observable<User[]>;
  professorAsigned!: User;
  professorToRevoke!: User;
  periodList = [1, 2];
  yearList = [1, 2, 3];

  newClassroom: Classroom = new Classroom();

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private userService: UserService,
    private classroomService: ClassroomService,
    private assignmentService: AssignmentService,
    private topicService: TopicService,
  ) {}

  ngOnInit(): void {
    this.getAllSubjects();
    this.getAllProfessors();
    this.initForm();
  }

  private initForm(): void {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required],
      color: ['', Validators.required],
      professor: ['', Validators.required],
      year: ['', Validators.required],
      periods: this.fb.array([]),
    });

    this.addPeriodCheckboxes();
  }

  get periodFromArray(): FormArray {
    return this.subjectForm.get('periods') as FormArray;
  }

  private addPeriodCheckboxes(userCommissions: number[] = []): void {
    this.periodFromArray.clear();

    this.periodList.forEach((period) => {
      const isMarked = userCommissions.includes(period);
      this.periodFromArray.push(new FormControl(isMarked));
    });
  }

  private getSelectedValues(formArray: FormArray, referenceList: number[]): number[] {
    return formArray.value
      .map((checked: boolean, i: number) => (checked ? referenceList[i] : null))
      .filter((value: number | null) => value !== null);
  }

  getAllSubjects() {
    this.subjectList$ = this.subjectService.getAllSubjects();
  }

  getAllProfessors() {
    const role = 'DOCENTE';
    this.professorList$ = this.userService
      .allUsers()
      .pipe(map((users) => users.filter((u) => u.role === role)));
  }

  getProfessorToAssign(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.professorAsigned = data;
      },
      error: (err) => console.error('Hubo un error al buscar al profesor: ', err),
    });
  }

  getProfessorToRevoke(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (data) => {
        this.professorToRevoke = data;
        console.log('Profesor anterior identificado: ', this.professorToRevoke.name);
      },
      error: (err) => console.error('Hubo un error al obtener el profesor anterior: ', err),
    });
  }

  onSubmit() {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    const { name, color, professor, year } = this.subjectForm.value;
    const periods = this.getSelectedValues(this.periodFromArray, this.periodList);

    const newProfessorId = professor.includes(': ') ? professor.split(': ')[1] : professor.trim();

    this.newSubject = {
      ...(this.modo === 'editar' && { id: this.subjectToUpdateId! }),
      subject_name: name.trim(),
      color: color,
      professor_id: newProfessorId,
      year_level: year,
      academic_period: periods,
    };

    this.userService.getUserById(newProfessorId).subscribe({
      next: (profData) => {
        this.professorAsigned = profData;
        console.log('Nuevo profesor listo para asignar: ', this.professorAsigned.name);

        this.submitSubject(this.subjectToUpdateId || '');
      },
      error: (err) => console.error('Error al obtener el nuevo profesor asignado: ', err),
    });
  }

  submitSubject(id: string): void {
    if (this.modo === 'crear') {
      this.subjectService.createSubject(this.newSubject).subscribe({
        next: (subject) => {
          alert('Materia Creada Exitosamente.');
          this.subjectForm.reset();
          this.newSubject.id = (subject as Subject).id;
          this.updateProfessorsRelation();
          this.createAndAssignClassroom(subject as Subject);
        },
        error: (err) => console.error('Hubo un error al crear la materia: ', err),
      });
    }

    if (this.modo === 'editar') {
      this.subjectService.modifySubject(id, this.newSubject).subscribe({
        next: () => {
          alert('Materia Modificada Exitosamente.');
          this.updateProfessorsRelation();
        },
        error: (err) => console.error('Hubo un error al modificar la materia: ', err),
      });
    }
  }

  subjectToEdit(subject: Subject): void {
    this.modo = 'editar';
    this.subjectToUpdateId = subject.id!;
    this.newSubject = subject;

    this.addPeriodCheckboxes(this.newSubject.academic_period);

    this.subjectForm.patchValue({
      name: this.newSubject.subject_name,
      color: this.newSubject.color,
      professor: this.newSubject.professor_id,
      year: this.newSubject.year_level,
    });

    const initialProfessorId = subject.professor_id.includes(': ')
      ? subject.professor_id.split(': ')[1]
      : subject.professor_id;

    this.getProfessorToRevoke(initialProfessorId);
  }

  updateProfessorsRelation() {
    const subjectId = this.newSubject.id!;

    const isProfessorSwitch =
      this.modo === 'editar' &&
      this.professorToRevoke &&
      this.professorToRevoke.id !== this.professorAsigned.id;

    if (isProfessorSwitch) {
      this.professorToRevoke = {
        ...this.professorToRevoke,
        subjects_id: (this.professorToRevoke.subjects_id || []).filter(
          (id: string) => id !== subjectId,
        ),
      };

      this.userService.modifyUser(this.professorToRevoke.id!, this.professorToRevoke).subscribe({
        next: () => {
          console.log('Materia removida con éxito del profesor anterior.');
          this.addSubjectToNewProfessor(subjectId);
        },
        error: (err) => console.error('Error al remover materia del profesor anterior: ', err),
      });
    } else {
      this.addSubjectToNewProfessor(subjectId);
    }
  }

  addSubjectToNewProfessor(subjectId: string) {
    const currentSubjects = this.professorAsigned.subjects_id || [];

    if (!currentSubjects.includes(subjectId)) {
      this.professorAsigned = {
        ...this.professorAsigned,
        subjects_id: [...currentSubjects, subjectId],
      };

      this.userService.modifyUser(this.professorAsigned.id!, this.professorAsigned).subscribe({
        next: () => {
          console.log('Materia agregada con éxito al nuevo profesor.');
          window.location.reload();
        },
        error: (err) => console.error('Error al agregar materia al nuevo profesor: ', err),
      });
    } else {
      window.location.reload();
    }
  }

  createAndAssignClassroom(subject: Subject) {
    this.newClassroom = {
      subject_id: subject.id,
    };

    this.classroomService.createClassroom(this.newClassroom).subscribe({
      next: (classroom: Classroom) => {
        subject.classroom_id = classroom.id;

        this.subjectService.modifySubject(subject.id!, subject).subscribe({
          next: () => alert('Curso creado y asignado correctamente.'),
          error: (err) => console.error('Hubo un error al asignar el curso creado: ', err),
        });
      },
      error: (err) => console.error('Hubo un error al crear the curso: ', err),
    });
  }

  selectSubjectToDelete(e: Event): void {
    const element = e.target as HTMLSelectElement;
    const subjectId = element.value;

    this.subjectService.getSubjectById(subjectId).subscribe({
      next: (data) => {
        this.subjectToDeleteSel = data;
      },
      error: (err) => console.error('Error al seleccionar la materia: ', err),
    });
  }

  deleteSubject(): void {
    if (!this.subjectToDeleteSel) return;

    const confirmation = confirm(
      `¿Estás seguro de que deseas eliminar permanentemente la materia ${this.subjectToDeleteSel.subject_name} junto con su Aula, Temas, Actividades y desvincularla de todos los usuarios?`,
    );

    if (!confirmation) return;

    const subjectId = this.subjectToDeleteSel.id!;
    const classroomId = this.subjectToDeleteSel.classroom_id;

    let deleteCascade$: Observable<any> = of(null);

    if (classroomId) {
      deleteCascade$ = this.classroomService.getClassroomById(classroomId).pipe(
        take(1),
        switchMap((classroom: any) => {
          // Obtenemos la lista de IDs de los temas del aula
          const topicsIds: string[] = classroom.topics_id || [];

          if (topicsIds.length === 0) {
            return this.classroomService.deleteClassroom(classroomId);
          }

          // PASO 1: Traemos la información de cada Topic para conocer sus correspondientes 'assignment_id'
          const fetchTopicsRequests = topicsIds.map((id) =>
            this.topicService.getTopicById(id).pipe(take(1)),
          );

          return forkJoin(fetchTopicsRequests).pipe(
            switchMap((topicsData: any[]) => {
              // PASO 2: Recolectamos las peticiones de borrado para las Actividades (Assignments) usando sus IDs
              const deleteAssignmentsRequests = topicsData
                .filter((topic: any) => topic && topic.assignment_id)
                .map((topic: any) => this.assignmentService.deleteAssignment(topic.assignment_id));

              // PASO 3: Recolectamos las peticiones de borrado para los Temas (Topics)
              const deleteTopicsRequests = topicsIds.map((id) => this.topicService.deleteTopic(id));

              // Ejecutamos primero el borrado de actividades si existen
              const assignmentsStep$ =
                deleteAssignmentsRequests.length > 0 ? forkJoin(deleteAssignmentsRequests) : of([]);

              return assignmentsStep$.pipe(
                // PASO 4: Una vez limpias las actividades, borramos los temas
                switchMap(() => forkJoin(deleteTopicsRequests)),
                // PASO 5: Una vez limpios los temas, eliminamos el contenedor Classroom
                switchMap(() => this.classroomService.deleteClassroom(classroomId)),
              );
            }),
          );
        }),
      );
    }

    // PASO 6 y 7: Desvincular usuarios y eliminar la materia de la base de datos
    deleteCascade$
      .pipe(
        switchMap(() => this.userService.allUsers().pipe(take(1))),
        switchMap((users) => {
          const usersToUpdate = users.filter(
            (user) => user.subjects_id && user.subjects_id.includes(subjectId),
          );

          if (usersToUpdate.length === 0) return of([]);

          const updateRequests = usersToUpdate.map((user) => {
            const updatedUser = {
              ...user,
              subjects_id: user.subjects_id!.filter((id) => id !== subjectId),
            };
            return this.userService.modifyUser(updatedUser.id!, updatedUser);
          });

          return forkJoin(updateRequests);
        }),
        switchMap(() => this.subjectService.deleteSubject(subjectId)),
      )
      .subscribe({
        next: () => {
          alert('Materia, aula virtual, temas y actividades asociados eliminados correctamente.');
          window.location.reload();
        },
        error: (err) => {
          console.error('Hubo un error en el proceso de eliminación en cascada: ', err);
          alert('Ocurrió un error al intentar eliminar la materia y sus dependencias.');
        },
      });
  }

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar') {
    this.modo = nuevoModo;
  }
}
