import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Aviso } from '../../../notices/temp.model.notices';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-notice-details',
  imports: [CommonModule],
  templateUrl: './notice-details.html',
  styleUrl: '../notices.css',
})
export class NoticeDetails implements OnInit{
  avisoActual!: Aviso;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // 1. Obtener el ID de la ruta
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // 2. Simulación de búsqueda (En un caso real, usarías un Service)
    this.avisoActual = {
      id: id,
      autor: 'Ignacio Fontaine',
      fotoAutor: 'assets/profesor-ignacio.jpg',
      asunto: 'Suspensión de clases',
      fecha: '12/06/2026',
      mensaje: {
        saludo: 'Buenos días chicos',
        cuerpo: [
          'Paso a informarles que el día de mañana no asistiré a clases debido a un asunto personal que me ha surgido.',
          'Les dejo subida la actividad para que la realicen y la entreguen para la clase de la semana que viene.'
        ]
      }
    };
  }
}
