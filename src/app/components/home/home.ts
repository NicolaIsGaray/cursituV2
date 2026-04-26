import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface HomeOption {
  title: string;
  icon: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  options: HomeOption[] = [
    { title: 'Materias', icon: 'book', description: 'Gestiona tus asignaturas y contenidos.', route: '/subjects' },
    { title: 'Grupos', icon: 'groups', description: 'Colabora con tus compañeros de estudio.', route: '/groups' },
    { title: 'Curso', icon: 'school', description: 'Información general de tu cursado.', route: '/classroom' },
    { title: 'Notificaciones', icon: 'notifications', description: 'Revisa las últimas novedades.', route: '/notifications' },
    { title: 'Tareas Pendientes', icon: 'assignment', description: 'Organiza tus entregas.', route: '/pending-tasks' }
  ];

  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}