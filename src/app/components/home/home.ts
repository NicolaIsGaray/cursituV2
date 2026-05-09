import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

interface HomeOption {
  title: string;
  icon: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit{
  options: HomeOption[] = [
    { title: 'Materias', icon: 'book', description: 'Gestiona tus asignaturas y contenidos.', route: '/subjects' },
    { title: 'Grupos', icon: 'groups', description: 'Colabora con tus compañeros de estudio.', route: '/groups' },
    { title: 'Curso', icon: 'school', description: 'Información general de tu cursado.', route: '/classroom' },
    { title: 'Notificaciones', icon: 'notifications', description: 'Revisa las últimas novedades.', route: '/notifications' },
    { title: 'Tareas Pendientes', icon: 'assignment', description: 'Organiza tus entregas.', route: '/pending-tasks' }
  ];

  users: User[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.allUsers().subscribe({
      next: (data) => {
        this.users = data;
        console.log(this.users);
      }
    })
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}