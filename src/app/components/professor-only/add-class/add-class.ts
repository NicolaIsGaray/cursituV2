import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-class',
  imports: [RouterModule, CommonModule],
  templateUrl: './add-class.html',
  styleUrl: './add-class.css',
})
export class AddClass {
  constructor(public authService: AuthService) {}
}
