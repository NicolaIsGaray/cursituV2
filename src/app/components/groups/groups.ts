import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-groups',
  imports: [CommonModule, RouterModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups {
  materias = [
    { id: 1, nombre: 'Programación Orientada a Objetos', color: '#ff8c2e' },
    { id: 2, nombre: 'Base de Datos Avanzada', color: '#2ecc71' },
    { id: 3, nombre: 'Sistemas Operativos Aplicados', color: '#3b67be' },
    { id: 4, nombre: 'Redes y Comunicaciones Distribuidas', color: '#b5b200' }
  ];

  materiaSeleccionada = this.materias[0];

  grupoActual = {
    numero: 4,
    integrantes: [
      { nombre: 'Facundo Garay Gonzalez', comision: 'Comisión A', rol: 'Estudiante', foto: 'assets/user.jpg' },
      { nombre: 'Facundo Garay Gonzalez', comision: 'Comisión A', rol: 'Estudiante', foto: 'assets/user.jpg' },
      { nombre: 'Facundo Garay Gonzalez', comision: 'Comisión A', rol: 'Estudiante', foto: 'assets/user.jpg' },
      { nombre: 'Facundo Garay Gonzalez', comision: 'Comisión A', rol: 'Estudiante', foto: 'assets/user.jpg' }
    ]
  };

  constructor(public authService: AuthService) {}

  seleccionarMateria(materia: any) {
    this.materiaSeleccionada = materia;
    // Aquí podrías llamar a un servicio para cargar los integrantes de esta materia
  }
}
