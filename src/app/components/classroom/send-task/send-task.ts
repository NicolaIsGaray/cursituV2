import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-send-task',
  imports: [CommonModule, RouterModule],
  templateUrl: './send-task.html',
  styleUrl: './send-task.css',
})
export class SendTask {
  // Este valor lo obtendrías del router o de un servicio
  materiaColor: string = '#ff8c2e'; // El color naranja de POO

  // Usamos una propiedad CSS personalizada para reutilizar el color en los botones
  get materiaColorStyle() {
    return { '--materia-color': this.materiaColor };
  }
}