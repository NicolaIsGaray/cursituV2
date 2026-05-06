import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-manage-finals',
  imports: [RouterModule, CommonModule],
  templateUrl: './manage-finals.html',
  styleUrl: './manage-finals.css',
})
export class ManageFinals {
  constructor(public authService: AuthService) {}
}
