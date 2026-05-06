import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UiService } from './service/ui-service';
import { AuthService, Rol } from './service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('cursitu');

  isSidebarOpen = false;

  constructor(
    public uiService: UiService,
    public authService: AuthService,
    private router: Router
  ) {}

  menuItems: any[] = [];

  ngOnInit() {
    this.authService.userRole$.subscribe((rol) => {
      this.buildMenu(rol);
    });
  }

  buildMenu(rol: Rol) {
    const baseMenu = [
      { path: '/home', icon: 'home', label: 'Inicio' },
      { path: '/subjects', icon: 'widgets', label: 'Materias' },
    ];

    if (rol === 'DOCENTE') {
      this.menuItems = [
        ...baseMenu,
        { path: '/my-classes', icon: 'class', label: 'Gestión de Clases' },
        { path: '/reports', icon: 'analytics', label: 'Reportes' },
      ];
    } else {
      this.menuItems = [
        ...baseMenu,
        { path: '/groups', icon: 'group', label: 'Mis Grupos' },
        { path: '/pending-tasks', icon: 'grid_view', label: 'Tareas' },
      ];
    }
  }

  // En el .ts correspondiente
  cambiarRol(event: any) {
    this.authService.setSimulatedRole(event.target.value);
  }

  // Retorna true si la ruta actual es /login
  isLoginPage(): boolean {
    return this.router.url === '/login';
  }
}
