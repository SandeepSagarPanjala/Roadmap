import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div class="max-w-md w-full relative">
        <!-- Decorative glowing orbs -->
        <div class="absolute -top-16 -left-16 w-56 h-56 bg-indigo-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div class="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style="animation-delay: 2s;"></div>
        
        <div class="bg-slate-900/50 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8 relative z-10">
          <div class="text-center mb-10">
            <h2 class="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
            <p class="text-slate-400 mt-2 text-sm">Sign in to securely manage your portal</p>
          </div>
          
          @if(error()) {
            <div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-bounce-short">
              {{ error() }}
            </div>
          }
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input 
                type="text" 
                formControlName="username"
                class="block w-full rounded-xl bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 px-4 py-3 transition duration-200 outline-none"
                placeholder="Enter your username"
              >
            </div>
            
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-slate-300">Password</label>
                <a href="#" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
              </div>
              <input 
                type="password" 
                formControlName="password"
                class="block w-full rounded-xl bg-slate-800/50 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 px-4 py-3 transition duration-200 outline-none"
                placeholder="••••••••"
              >
            </div>
            
            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading()"
              class="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_25px_rgba(79,70,229,0.6)]"
            >
              @if(isLoading()) {
                <span class="mr-2">Authenticating...</span>
              } @else {
                <span class="relative z-10 w-full text-center">Sign In Now</span>
              }
            </button>
          </form>
          
          <p class="mt-8 text-center text-sm text-slate-400">
            Don't have an account? 
            <a routerLink="/register" class="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">Create one now</a>
          </p>
        </div>
      </div>
    </div>
  `,
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

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.error?.message || 'Invalid credentials');
        }
      });
    }
  }
}
