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
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { SubjectService } from '../../../services/subject.service';
import { UserService } from '../../../services/user.service';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';

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
  periodList = [1, 2];
  yearList = [1, 2, 3];

  newClassroom: Classroom = new Classroom();

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private userService: UserService,
    private classroomService: ClassroomService
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

  onSubmit() {
    if (this.subjectForm.invalid) {
      this.subjectForm.markAllAsTouched();
      return;
    }

    const { name, color, professor, year } = this.subjectForm.value;
    const periods = this.getSelectedValues(this.periodFromArray, this.periodList);

    this.newSubject = {
      ...(this.modo === 'editar' && { id: this.subjectToUpdateId! }),
      subject_name: name.trim(),
      color: color,
      professor_id: professor.trim(),
      year_level: year,
      academic_period: periods,
    };

    console.log('Datos listos para enviar: ', this.newSubject);
    this.submitSubject(this.subjectToUpdateId || '');
  }

  submitSubject(id: string): void {
    if (this.modo === 'crear') {
      this.subjectService.createSubject(this.newSubject).subscribe({
        next: (subject) => {
          alert('Materia Creada Exitosamente.');
          this.subjectForm.reset();
          this.createAndAssignClassroom(subject as Subject);
          window.location.reload();
        },
        error: (err) => console.error('Hubo un error al crear la materia: ', err),
      });
    }

    if (this.modo === 'editar') {
      this.subjectService.modifySubject(id, this.newSubject).subscribe({
        next: () => {
          alert("Materia Modificada Exitosamente.")
          window.location.reload();
        },
        error: (err) => console.error("Hubo un error al modificar la materia: ", err)
      })
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
      error: (err) => console.error('Hubo un error al crear el curso: ', err),
    });
  }

  selectSubjectToDelete(e: Event): void {
    const element = e.target as HTMLSelectElement;
    const subjectId = element.value;

    this.subjectService.getSubjectById(subjectId).subscribe({
      next: (data) => {
        this.subjectToDeleteSel = data;
      },
      error: (err) => console.error("Error al seleccionar la materia: ", err)      
    })
  }

  deleteSubject(): void {
    if (!this.subjectToDeleteSel) return;

    const confirmation = confirm(
      `¿Estás seguro de que deseas eliminar permanentemente la materia ${this.subjectToDeleteSel.subject_name}?`
    );

    if (confirmation) {
      this.subjectService.deleteSubject(this.subjectToDeleteSel.id!).subscribe({
        next: () => {
          alert("Materia Eliminada Exitosamente.")
          window.location.reload();
        },
        error: (err) => console.error("Error al intentar eliminar la materia: ", err)
      })
    }
  }

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar') {
    this.modo = nuevoModo;
  }
}
