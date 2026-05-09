import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Rol = 'ALUMNO' | 'DOCENTE';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Clave para guardar el rol en el navegador
  private readonly ROL_KEY = 'cursitu_mock_role';
  
  // Observable que emitirá el rol actual a toda la app
  private roleSubject = new BehaviorSubject<Rol>((localStorage.getItem(this.ROL_KEY) as Rol) || 'ALUMNO');
  userRole$ = this.roleSubject.asObservable();

  constructor() {}

  // Método para cambiar el rol manualmente y recargar la UI
  setSimulatedRole(nuevoRol: Rol) {
    localStorage.setItem(this.ROL_KEY, nuevoRol);
    this.roleSubject.next(nuevoRol);
  }

  get currentRole(): Rol {
    return this.roleSubject.value;
  }
}