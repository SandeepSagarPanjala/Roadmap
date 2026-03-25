import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ApiRoutes } from '../constants/api.constants';

export interface Tokens {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  // Reactive UI tracking: automatically updates if logged in state changes
  public readonly isAuthenticated = signal<boolean>(!!this.getAccessToken());

  getAccessToken(): string | null {
    return localStorage.getItem(environment.tokenStorageKey);
  }

  saveTokens(tokens: Tokens): void {
    localStorage.setItem(environment.tokenStorageKey, tokens.accessToken);
    this.isAuthenticated.set(true); // Signal reactivity triggers UI change!
  }

  clearTokens(): void {
    localStorage.removeItem(environment.tokenStorageKey);
    this.isAuthenticated.set(false); // Signal reactivity triggers UI change!
  }

  login(credentials: any): Observable<any> {
    // Node API now sets an HttpOnly cookie on success!
    return this.http.post<any>(ApiRoutes.Auth.Login, credentials).pipe(
      tap(res => {
        this.saveTokens({ accessToken: res.accessToken });
      })
    );
  }

  // The Silent Rotation Function
  refreshTokens(): Observable<Tokens> {
    // Browser silently sends the Cookie! We no longer need to read it from anywhere visible to Angular.
    return this.http.post<Tokens>(ApiRoutes.Auth.Refresh, {}, { withCredentials: true }).pipe(
      tap(res => {
        this.saveTokens({ accessToken: res.accessToken });
      })
    );
  }

  logout(): void {
    // Blast the Node API to destroy the cookie and backend memory
    this.http.post(ApiRoutes.Auth.Logout, {}, { withCredentials: true }).subscribe({
      next: () => this.executeLogout(),
      error: () => this.executeLogout()
    });
  }

  private executeLogout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }
}
