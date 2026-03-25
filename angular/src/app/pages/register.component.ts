import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center p-4 selection:bg-purple-500/30">
      <div class="max-w-md w-full mx-auto relative">
        <!-- Abstract gradient shapes behind the form -->
        <div class="absolute -top-10 -right-10 w-48 h-48 bg-emerald-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        <div class="absolute -bottom-10 left-10 w-48 h-48 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 1.5s;"></div>
        
        <div class="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-800 p-8 sm:p-10 relative z-10">
          <div class="mb-10">
            <h2 class="text-3xl font-extrabold text-white tracking-tight">Create Account</h2>
            <p class="text-emerald-400 mt-2 text-sm font-medium">Join the secure portal ecosystem</p>
          </div>
          
          @if(error()) {
            <div class="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
              {{ error() }}
            </div>
          }
          
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5 cursor-pointer">Choose Username</label>
              <input 
                type="text" 
                formControlName="username"
                class="block w-full rounded-xl bg-slate-800/80 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 px-4 py-3.5 transition duration-200 outline-none"
                placeholder="developer_21"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-1.5 cursor-pointer">Secure Password</label>
              <input 
                type="password" 
                formControlName="password"
                class="block w-full rounded-xl bg-slate-800/80 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white placeholder-slate-500 px-4 py-3.5 transition duration-200 outline-none"
                placeholder="••••••••"
              >
            </div>
            
            <button 
              type="submit" 
              [disabled]="registerForm.invalid || isLoading()"
              class="w-full relative py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-800 border border-emerald-500 hover:bg-emerald-600 hover:border-emerald-400 transition-all duration-300 disabled:opacity-50 mt-4 overflow-hidden group shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
            >
              @if(isLoading()) {
                <span class="mr-2">Creating Identity...</span>
              } @else {
                <span class="relative z-10 tracking-wide text-emerald-50 group-hover:text-white transition-colors">Register Identity</span>
              }
            </button>
          </form>
          
          <div class="mt-8 text-center">
            <p class="text-sm text-slate-400 bg-slate-950/50 py-3 rounded-xl border border-slate-800/50">
              Already engineered your account? 
              <br class="sm:hidden" />
              <a routerLink="/login" class="font-bold text-emerald-400 hover:text-emerald-300 transition-colors ml-1">Log in here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);

  registerForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  isLoading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      
      // Hit Node API directly for registration since authService handles login/refresh
      this.http.post('http://localhost:3000/api/auth/register', this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.error?.message || 'Failed to create account. User might already exist.');
        }
      });
    }
  }
}
