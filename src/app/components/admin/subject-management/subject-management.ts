import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-subject-management',
  imports: [CommonModule],
  templateUrl: './subject-management.html',
  styleUrl: './subject-management.css',
})
export class SubjectManagement {
  modo: 'crear' | 'editar' | 'eliminar' | null = null;

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar') {
    this.modo = nuevoModo;
  }
}
