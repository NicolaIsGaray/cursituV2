import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-send-task',
  imports: [CommonModule],
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