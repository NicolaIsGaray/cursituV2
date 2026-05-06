import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UiService } from '../../../service/ui-service';

@Component({
  selector: 'app-transmission-live',
  imports: [],
  templateUrl: './transmission-live.html',
  styleUrl: './transmission-live.css',
  encapsulation: ViewEncapsulation.None
})
export class TransmissionLive implements OnInit, OnDestroy{
  constructor(
    private router: Router,
    private uiService: UiService
  ) { }

  ngOnInit(): void {
    // Ocultar sidebar y top-bar al iniciar la transmisión
    setTimeout(() => {
      this.uiService.setNavigationVisibility(false);
    })
  }

  ngOnDestroy(): void {
    // Reestablecer la navegación al salir del componente (destrucción)
    this.uiService.setNavigationVisibility(true);
  }

  salirDeTransmision(): void {
    if (confirm('¿Deseas salir de la transmisión en vivo?')) {
      this.router.navigate(['/transmission-lobby']);
    }
  }
}
