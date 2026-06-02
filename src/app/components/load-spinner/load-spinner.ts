import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadService } from '../../services/load.service';

@Component({
  selector: 'app-load-spinner',
  imports: [CommonModule],
  templateUrl: './load-spinner.html',
  styleUrl: './load-spinner.css',
})
export class LoadSpinner {
  private loadService = inject(LoadService);
  
  isLoading = this.loadService.isLoading;
}
