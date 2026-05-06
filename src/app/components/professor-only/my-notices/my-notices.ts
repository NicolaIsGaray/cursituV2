import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-my-notices',
  imports: [CommonModule],
  templateUrl: './my-notices.html',
  styleUrl: './my-notices.css',
})
export class MyNotices {
  constructor(public authService: AuthService) {}
}
