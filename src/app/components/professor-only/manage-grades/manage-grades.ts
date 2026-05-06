import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-manage-grades',
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-grades.html',
  styleUrl: './manage-grades.css',
})
export class ManageGrades {
  constructor (public authService: AuthService) {}
}
