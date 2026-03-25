import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
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
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(tokens: Tokens): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    this.isAuthenticated.set(true); // Signal reactivity triggers UI change!
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.isAuthenticated.set(false); // Signal reactivity triggers UI change!
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap(res => {
        this.saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      })
    );
  }

  // The Silent Rotation Function
  refreshTokens(): Observable<Tokens> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<Tokens>('/api/auth/refresh', { token: refreshToken }).pipe(
      tap(res => {
        this.saveTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
      })
    );
  }

  logout(): void {
    const token = this.getRefreshToken();
    if (token) {
      // Best Practice: Tell the Node API to delete it from the Map!
      this.http.post('/api/auth/logout', { token }).subscribe({
        next: () => this.executeLogout(),
        error: () => this.executeLogout()
      });
    } else {
      this.executeLogout();
    }
  }

  private executeLogout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }
}
