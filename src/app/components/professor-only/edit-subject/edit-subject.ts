import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-edit-subject',
  imports: [RouterModule, CommonModule],
  templateUrl: './edit-subject.html',
  styleUrl: './edit-subject.css',
})
export class EditSubject {
  materia = {
    nombre: 'Programación Orientada a Objetos',
    color: '#ff8c2e'
  };

  constructor(public authService: AuthService) {}
}
