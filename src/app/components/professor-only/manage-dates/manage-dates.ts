import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-dates',
  imports: [RouterModule, CommonModule],
  templateUrl: './manage-dates.html',
  styleUrl: './manage-dates.css',
})
export class ManageDates {
  constructor(public authService: AuthService) {}
}
