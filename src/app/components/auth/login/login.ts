import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }
}