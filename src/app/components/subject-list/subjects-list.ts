import { Component } from '@angular/core';
import { Materia } from '../../subjects/temp-subjects';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-subjects',
  imports: [CommonModule],
  templateUrl: './subjects-list.html',
  styleUrls: ['./subjects-list.css']
})
export class SubjectsList {
  materias: Materia[] = [
    { id: 1, nombre: 'Programación Orientada a Objetos', docente: 'Ignacio Fontaine', color: '#ff8c2e' },
    { id: 2, nombre: 'Base de Datos Avanzada', docente: 'Luis Chiaramonte', color: '#2ecc71' },
    { id: 3, nombre: 'Sistemas Operativos Aplicados', docente: 'Mauricio Prades', color: '#3b67be' },
    { id: 4, nombre: 'Redes y Sistemas Distribuidos', docente: 'Gerardo Abrego', color: '#797a2d' }
  ];

  constructor(private router: Router, public authService: AuthService) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}