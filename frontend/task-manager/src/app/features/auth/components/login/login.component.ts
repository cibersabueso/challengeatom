import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';
  showCreateUserDialog = false;
  emailToCreate = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    this.loading = true;
    this.error = '';

    this.authService.checkUser(email).subscribe({
      next: (response) => {
        if (response.exists && response.user) {
          this.authService.login(response.user).subscribe(() => {
            this.router.navigate(['/tasks']);
          });
        } else {
          this.emailToCreate = email;
          this.showCreateUserDialog = true;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al verificar el usuario';
        this.loading = false;
      }
    });
  }

  createUser(): void {
    this.loading = true;
    this.error = '';

    this.authService.createUser(this.emailToCreate).subscribe({
      next: (user) => {
        this.authService.login(user).subscribe(() => {
          this.router.navigate(['/tasks']);
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al crear el usuario';
        this.loading = false;
        this.showCreateUserDialog = false;
      }
    });
  }

  cancelCreateUser(): void {
    this.showCreateUserDialog = false;
  }
}