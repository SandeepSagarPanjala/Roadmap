import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiRoutes } from '../../../core/constants/api.constants';
import { Messages } from '../../../core/constants/messages.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      // Hit Node API directly for registration since authService handles login/refresh
      this.http.post(ApiRoutes.Users.Add, this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(
            err.error?.message || Messages.Auth.RegistrationFailed,
          );
        },
      });
    }
  }
}
