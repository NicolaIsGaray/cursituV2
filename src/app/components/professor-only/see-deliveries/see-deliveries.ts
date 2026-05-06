import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-see-deliveries',
  imports: [RouterModule, CommonModule],
  templateUrl: './see-deliveries.html',
  styleUrl: './see-deliveries.css',
})
export class SeeDeliveries {
  constructor(public authService: AuthService) {}
}
