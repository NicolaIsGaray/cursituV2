import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-students-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './students-list.html',
  styleUrl: './students-list.css',
})
export class StudentsList {
  constructor(public authService: AuthService) {}
}
