import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-page-configuration',
  imports: [CommonModule],
  templateUrl: './page-configuration.html',
  styleUrl: './page-configuration.css',
})
export class PageConfiguration {
  toggleTheme(event: any) {
  const theme = event.target.checked ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme); // Guardar preferencia
}
}
