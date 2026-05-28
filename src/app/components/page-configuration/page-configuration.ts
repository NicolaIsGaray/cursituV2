import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-page-configuration',
  imports: [CommonModule],
  templateUrl: './page-configuration.html',
  styleUrl: './page-configuration.css',
})
export class PageConfiguration implements OnInit {
  public themeService = inject(ThemeService);

  public isDark = false;
  public audioEnabled = true;

  ngOnInit(): void {
    this.isDark = localStorage.getItem('theme') === 'dark';
  }
}
