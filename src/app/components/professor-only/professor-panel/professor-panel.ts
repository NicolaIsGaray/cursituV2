import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AuthService } from '../../../service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professor-panel',
  imports: [RouterModule, CommonModule],
  templateUrl: './professor-panel.html',
  styleUrl: './professor-panel.css',
})
export class ProfessorPanel {
  constructor(public authService: AuthService) {}
}
