import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-announcement-panel',
  imports: [CommonModule],
  templateUrl: './announcement-panel.html',
  styleUrl: './announcement-panel.css',
})
export class AnnouncementPanel {
  modo: 'crear' | 'editar' | 'eliminar' | null = null;

  cambiarModo(nuevoModo: 'crear' | 'editar' | 'eliminar') {
    this.modo = nuevoModo;
  }
}
