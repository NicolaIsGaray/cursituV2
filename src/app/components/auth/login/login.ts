import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  userData!: User;

  constructor(
    private fb: FormBuilder,
    public authService: AuthService,
    private router: Router
  ) {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      dni: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

onSubmit() {
    if (this.loginForm.valid) {
      // Extraemos los valores del formulario
      const credentials = this.loginForm.value as any;

      this.authService.login(credentials).subscribe({
        next: (user) => {
          console.log('Login exitoso:', user);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          alert('Credenciales inválidas. Intenta de nuevo.');
          console.error(err);
        }
      });
    }
  }

  login() : void {
    this.authService.login(this.userData).subscribe({
      next: (response) => {
        alert("Login exitoso.");
        this.router.navigate(['/home'])
      },
      error: (err) => {
        alert("Usuario no encontrado.")
        console.error(err);
      }
    })
  }
}