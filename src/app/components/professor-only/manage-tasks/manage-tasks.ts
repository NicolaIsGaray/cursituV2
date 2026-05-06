import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-manage-tasks',
  imports: [RouterModule, CommonModule],
  templateUrl: './manage-tasks.html',
  styleUrl: './manage-tasks.css',
})
export class ManageTasks {
  constructor(public authService: AuthService) {}
}
