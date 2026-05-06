import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../service/auth-service';

@Component({
  selector: 'app-students-list',
  imports: [CommonModule],
  templateUrl: './students-list.html',
  styleUrl: './students-list.css',
})
export class StudentsList {
  constructor(public authService: AuthService) {}
}
