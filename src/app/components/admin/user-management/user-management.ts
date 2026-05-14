import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement {
  modo: 'crear' | 'editar' | 'eliminar' | null = null;

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar') {
    this.modo = nuevoModo;
  }
}
