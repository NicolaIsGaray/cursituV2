import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-manage-tasks',
  imports: [RouterModule, CommonModule],
  templateUrl: './manage-assignments.html',
  styleUrl: './manage-assignments.css',
})
export class ManageAssignments {
  constructor(public authService: AuthService, private location: Location) {}

  goBack() {
    this.location.back();
  }
}
