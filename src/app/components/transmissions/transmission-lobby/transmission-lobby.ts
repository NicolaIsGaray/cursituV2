import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";

interface Sala {
  id: number;
  nombre: string;
  estado: 'Transmitiendo' | 'En Espera';
}

@Component({
  selector: 'app-transmission-lobby',
  imports: [CommonModule, RouterModule],
  templateUrl: './transmission-lobby.html',
  styleUrl: './transmission-lobby.css',
})
export class TransmissionLobby implements OnInit{
  // Simulación de datos dinámicos para las salas
  salas: Sala[] = [
    { id: 1, nombre: 'Grupo #1', estado: 'Transmitiendo' },
    { id: 2, nombre: 'Grupo #2', estado: 'En Espera' },
    { id: 3, nombre: 'Grupo #3', estado: 'En Espera' },
    { id: 4, nombre: 'Grupo #4', estado: 'En Espera' }
  ];

  constructor() { }

  ngOnInit(): void { }

  triggerFileUpload(): void {
    console.log('Abriendo selector de archivos...');
  }

  sortGroups(): void {
    console.log('Definiendo orden de exposición...');
  }

  entrarASala(id: number): void {
    console.log(`Accediendo a la transmisión de la sala ${id}`);
  }

  finalizarConfiguracion(): void {
    alert('Configuración guardada correctamente.');
  }
}
