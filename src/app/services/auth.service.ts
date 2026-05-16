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
  private route = inject(Router); // Consistencia con inject()
  private apiUrl = 'http://localhost:8080/api/auth';

  private readonly ROL_KEY = 'cursitu_mock_role';
  private readonly USER_KEY = 'cursitu_mock_user';

  // 1. Inicializamos el BehaviorSubject del usuario leyendo el localStorage de forma segura
  private userSubject = new BehaviorSubject<User | null>(this.getUserFromLocalStorage());
  
  // 2. Exponemos el Observable público para los componentes (Navbar, Home, etc.)
  currentUser$ = this.userSubject.asObservable();

  // Observable existente para el rol
  private roleSubject = new BehaviorSubject<Role>(
    (localStorage.getItem(this.ROL_KEY) as Role) || 'ALUMNO'
  );
  userRole$ = this.roleSubject.asObservable();

  constructor() {}

  login(user: LoginData): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, user).pipe(
      map((loggedUser) => {
        if (loggedUser && loggedUser.role) {
          // Guardamos el rol de forma reactiva
          this.setSimulatedRole(loggedUser.role as Role);
          
          // Guardamos el usuario en localStorage y notificamos al Subject reactivo
          localStorage.setItem(this.USER_KEY, JSON.stringify(loggedUser));
          this.userSubject.next(loggedUser);
        }
        return loggedUser;
      })
    );
  }

  setSimulatedRole(nuevoRol: Role) {
    localStorage.setItem(this.ROL_KEY, nuevoRol);
    this.roleSubject.next(nuevoRol);
  }

  get currentRole(): Role {
    return this.roleSubject.value;
  }

  // Getter síncrono por si necesitas el valor instantáneo en código TS sin suscribirte
  get currentUserValue(): User | null {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.ROL_KEY);
    
    // Notificamos a los flujos reactivos que ya no hay usuario ni rol administrador
    this.userSubject.next(null);
    this.roleSubject.next('ALUMNO' as Role); 

    this.getAuthStatus();
  }

  getAuthStatus() {
    if (!this.currentUserValue) {
      this.route.navigate(['/login']);
      return;
    }

    if (this.currentRole === 'ADMIN') {
      this.route.navigate(['/user-management']);
    }
  }

  // Método auxiliar privado para el constructor del Subject
  private getUserFromLocalStorage(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error al parsear el usuario del localStorage', error);
      return null;
    }
  }
}