import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Messages } from '../../../core/constants/messages.constants';
import { LoginUserMutationVariables } from '../../../core/services/auth/auth.generated';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styles: [`
    @keyframes bounce-short {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .animate-bounce-short { animation: bounce-short 0.5s ease-in-out; }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      const credentials = this.loginForm.value as LoginUserMutationVariables;
      this.authService.login(credentials).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.message || Messages.Auth.LoginFailed);
        }
      });
    }
  }
}
