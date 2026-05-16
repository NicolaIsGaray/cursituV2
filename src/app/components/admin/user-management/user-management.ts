import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
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
  userList$!: Observable<User[]>;

  roleList = [{ name: 'ALUMNO' }, { name: 'DOCENTE' }];
  comissionList = ['A', 'B'];
  subjectToAssignList: string[] = [];

  subjectList: Subject[] = [];

  dniControl = new FormControl('');
  usersFound: User[] = [];

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
      classroom_number: ['', Validators.required],
      comissions: this.fb.array([]),
      assigned_subjects: this.fb.array([]),
    });

    this.addComissionCheckboxes();
  }

  get comissionFormArray(): FormArray {
    return this.userForm.get('comissions') as FormArray;
  }

  get subjectFormArray(): FormArray {
    return this.userForm.get('assigned_subjects') as FormArray;
  }

  private addComissionCheckboxes(userComissions: any[] = []): void {
    this.comissionFormArray.clear();

    this.comissionList.forEach(() => {
      const isMarked = userComissions.some((c) => c === 'A' || 'B');

      this.comissionFormArray.push(new FormControl(isMarked));
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

  onSubmit(e: Event): void {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const { fullname, dni, email, role, classroom_number } = this.userForm.value;
    const comission = this.getSelectedValuesToString(this.comissionFormArray, this.comissionList);
    const assigned_subjects = this.getSelectedValuesToString(
      this.subjectFormArray,
      this.subjectToAssignList,
    );

    this.newUser = {
      // Si estamos editando, conservamos el ID original
      ...(this.modo === 'editar' && { id: this.userToUpdateId! }),
      name: fullname.trim(),
      email: email.trim(),
      dni: dni,
      password: dni, // Nota de seguridad: el backend suele encargarse de esto, pero si lo requieres aquí, está bien.
      role: role,
      comission: comission,
      classroom_number: classroom_number,
      subjects_id: assigned_subjects,
    };

    console.log('Datos listos para enviar al backend:', this.newUser);

    // Le pasamos el ID correcto que guardamos en memoria, o vacío si es creación
    this.submitUser(this.userToUpdateId || '');
  }

  submitUser(id: string): void {
    if (this.modo === 'crear') {
      this.userService.createUser(this.newUser).subscribe({
        next: () => {
          alert('Usuario Registrado Exitosamente.');
          this.userForm.reset(); // Limpieza post-envío
        },
        error: (err) => console.error('Hubo un error al registrar al usuario: ', err),
      });
    }

    if (this.modo === 'editar') {
      console.log('Actualizando ID:', id, 'con datos:', this.newUser);

      this.userService.modifyUser(id, this.newUser).subscribe({
        next: () => {
          alert('Usuario Modificado Exitosamente.');
          this.userToUpdateId = null; // Reseteamos el estado de edición
          this.userForm.reset();
        },
        error: (err) => console.error('Hubo un error al modificar al usuario:', err),
      });
    }
  }

  userToEdit(user: User): void {
    this.modo = 'editar';
    this.userToUpdateId = user.id!;
    this.newUser = user;

    this.addComissionCheckboxes(this.newUser.comission);
    this.addSubjectCheckboxes(this.newUser.subjects_id);

    this.userForm.patchValue({
      fullname: this.newUser.name,
      email: this.newUser.email,
      dni: this.newUser.dni,
      role: this.newUser.role,
      classroom_number: this.newUser.classroom_number,
    });
  }

  // Método que se ejecuta al hacer clic en una tarjeta de la lista flotante
  seleccionarUsuarioParaEliminar(user: any): void {
    this.userToDeleteSel = user;

    // Seteamos el DNI en el input de forma visual
    this.dniControl.setValue(user.dni, { emitEvent: false });

    // Vaciamos la lista para cerrar el desplegable
    this.usersFound = [];
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
        },
        error: (err) => console.error('Error al eliminar:', err),
      });
    }
  }

  searchDNI() {
    this.dniControl.valueChanges
      .pipe(
        filter((valor) => valor !== null && valor.length >= 1),

        debounceTime(300),

        // Si el valor es idéntico al anterior, no hace nada
        distinctUntilChanged(),

        // Cancela la petición anterior si entra una nueva (Evita condiciones de carrera)
        switchMap((valor) => this.userService.searchUserByDni(valor!)),
      )
      .subscribe({
        next: (resultados) => {
          this.usersFound = resultados;
        },
        error: (err) => console.error('Error en la búsqueda', err),
      });
  }

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar'): void {
    this.modo = nuevoModo;
  }
}
