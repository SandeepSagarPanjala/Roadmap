import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Messages } from '../../../core/constants/messages.constants';
import { AddUserGQL } from '../../../core/services/auth/auth.generated';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private addUserGQL = inject(AddUserGQL);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const formValue = this.registerForm.value;

      this.addUserGQL.mutate({
        variables: {
          username: formValue.username as string,
          email: formValue.email as string,
          password: formValue.password as string
        }
      }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(
            err.message || Messages.Auth.RegistrationFailed,
          );
        },
      });
    }
  }
}
