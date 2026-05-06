import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth-service';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-classroom',
  imports: [CommonModule, RouterModule],
  templateUrl: './current-classroom.html',
  styleUrl: './current-classroom.css',
})
export class CurrentClassroom {
  materiaColor: string = '#ff8c2e';

  constructor(public authService: AuthService) {}
}
