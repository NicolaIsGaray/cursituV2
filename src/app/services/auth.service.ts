import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Role } from '../models/roles';
import { Router } from '@angular/router';

export interface LoginData {
  dni: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  // Clave para guardar el rol en el navegador
  private readonly ROL_KEY = 'cursitu_mock_role';
  private readonly USER_KEY = 'cursitu_mock_user';

  login(user: LoginData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, user).pipe(
      map((loggedUser) => {
        if (loggedUser && loggedUser.role) {
          this.setSimulatedRole(loggedUser.role as Role);
          localStorage.setItem(this.USER_KEY, JSON.stringify(loggedUser));
        }
        return loggedUser;
      }),
    );
  }

  // Observable que emitirá el rol actual a toda la app
  private roleSubject = new BehaviorSubject<Role>(
    (localStorage.getItem(this.ROL_KEY) as Role) || 'ALUMNO',
  );
  userRole$ = this.roleSubject.asObservable();

  constructor(private route: Router) {}

  setSimulatedRole(nuevoRol: Role) {
    localStorage.setItem(this.ROL_KEY, nuevoRol);
    this.roleSubject.next(nuevoRol);
  }

  get currentRole(): Role {
    return this.roleSubject.value;
  }

  get currentUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error al parsear el usuario del localStorage', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROL_KEY);
    this.getAuthStatus();
  }

  // Método para verificar estado de autenticación
  getAuthStatus() {
    if (!this.currentUser) {
      this.route.navigate(['/login'])
    }

    if(this.currentRole === 'ADMIN') {
      this.route.navigate(['/user-management'])
    }
  }

}
