import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user.model';
import { Subject } from '../../../models/subject.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { SubjectService } from '../../../services/subject.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, isEmpty, Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  modo: 'crear' | 'editar' | 'eliminar' | null = null;

  userForm!: FormGroup;
  newUser: User = new User();
  userToUpdateId: string | null = null;
  userToDeleteSel: any = null;

  roleList = [{ name: 'ALUMNO' }, { name: 'DOCENTE' }];
  comissionList = ['A', 'B'];
  subjectToAssignList: string[] = [];

  subjectList: Subject[] = [];

  dniControl = new FormControl('');
  usersFound$!: Observable<User[]>;

  roleSwitch = true;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    private subjectService: SubjectService,
  ) {}

  ngOnInit(): void {
    this.getSubjectList();
    this.searchDNI();
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^\d+$/)]],
      role: ['', Validators.required],
      classroom_number: [''],
      comissions: this.fb.array([]),
      assigned_subjects: this.fb.array([]),
    });

    this.addComissionCheckboxes();
  }

  get comissionFromArray(): FormArray {
    return this.userForm.get('comissions') as FormArray;
  }

  get subjectFormArray(): FormArray {
    return this.userForm.get('assigned_subjects') as FormArray;
  }

  private addComissionCheckboxes(userCommissions: string[] = []): void {
    this.comissionFromArray.clear();

    this.comissionList.forEach((com) => {
      const isMarked = userCommissions.includes(com);
      this.comissionFromArray.push(new FormControl(isMarked));
    });
  }

  private addSubjectCheckboxes(userSubjects: any[] = []): void {
    this.subjectFormArray.clear();

    const userSubjectIds = new Set(userSubjects.map((s) => String(s)));

    this.subjectList.forEach((subject) => {
      const isMarked = userSubjectIds.has(String(subject.id));

      this.subjectFormArray.push(new FormControl(isMarked));
    });
  }

  private getSelectedValuesToString(formArray: FormArray, referenceList: string[]): string[] {
    return formArray.value
      .map((checked: boolean, i: number) => (checked ? referenceList[i] : null))
      .filter((value: string | null) => value !== null);
  }

  private getSubjectList(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this.subjectList = subjects;
        this.subjectToAssignList = this.subjectList.map((s) => s.id!);
        this.addSubjectCheckboxes();
      },
      error: (err) => console.error('Hubo un error al traer las materias: ', err),
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { fullname, dni, email, role, classroom_number } = this.userForm.value;
    const comission = this.getSelectedValuesToString(this.comissionFromArray, this.comissionList);
    const assigned_subjects = this.getSelectedValuesToString(
      this.subjectFormArray,
      this.subjectToAssignList,
    );

    this.newUser = {
      ...(this.modo === 'editar' && { id: this.userToUpdateId! }),
      name: fullname.trim(),
      email: email.trim(),
      dni: dni,
      password: this.modo === 'editar' ? this.newUser.password : dni,
      role: role,
      comission: comission,
      classroom_number: classroom_number,
      subjects_id: assigned_subjects,
    };

    console.log('Datos listos para enviar al backend:', this.newUser);

    this.submitUser(this.userToUpdateId || '');
  }

  submitUser(id: string): void {
    if (this.modo === 'crear') {
      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          alert('Usuario Registrado Exitosamente.');
          this.userForm.reset();
          window.location.reload();
        },
        error: (err) => console.error('Hubo un error al registrar al usuario: ', err),
      });
    }

    if (this.modo === 'editar') {
      console.log('Actualizando ID:', id, 'con datos:', this.newUser);

      this.userService.modifyUser(id, this.newUser).subscribe({
        next: () => {
          alert('Usuario Modificado Exitosamente.');
          this.userToUpdateId = null;
          this.userForm.reset();
          window.location.reload();
        },
        error: (err) => console.error('Hubo un error al modificar al usuario:', err),
      });
    }
  }

  userToEdit(user: User): void {
    this.modo = 'editar';
    this.userToUpdateId = user.id!;
    this.newUser = user;

    if (this.newUser.role === 'ALUMNO') {
      this.roleSwitch = true;
    } else {
      this.roleSwitch = false;
    }

    this.addComissionCheckboxes(this.newUser.comission);
    if (this.newUser.role !== 'DOCENTE') {
      this.addSubjectCheckboxes(this.newUser.subjects_id);
    }

    this.userForm.patchValue({
      fullname: this.newUser.name,
      email: this.newUser.email,
      dni: this.newUser.dni,
      role: this.newUser.role,
      classroom_number: this.newUser.classroom_number
    });
  }

  seleccionarUsuarioParaEliminar(user: any): void {
    this.userToDeleteSel = user;

    this.dniControl.setValue(user.dni, { emitEvent: false });
  }

  // Método de eliminación final
  deleteUser(): void {
    if (!this.userToDeleteSel) return;

    const confirmar = confirm(
      `¿Estás seguro de que deseas eliminar permanentemente a ${this.userToDeleteSel.name}?`,
    );

    if (confirmar) {
      this.userService.deleteUser(this.userToDeleteSel.id).subscribe({
        next: () => {
          alert('Usuario eliminado con éxito.');
          this.userToDeleteSel = null;
          this.dniControl.setValue('');
          window.location.reload();
        },
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }

  searchDNI() {
    this.usersFound$ = this.dniControl.valueChanges.pipe(
      filter((dni) => dni !== null && dni.length >= 1),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((dni) => this.userService.searchUserByDni(dni!)),
    );
  }

  switchSubjectCheckboxes(e: Event) {
    const element = e.target as HTMLSelectElement;
    const value = element.value;

    if (value === 'ALUMNO') {
      this.roleSwitch = true;
    } else {
      this.roleSwitch = false;
    }
  }

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar'): void {
    this.modo = nuevoModo;
  }
}
