import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ApiRoutes } from '../../core/constants/api.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  testSecureApi() {
    console.log("🚀 Firing Secure Request to /users...");
    this.http.get(ApiRoutes.Users.GetAll).subscribe({
      next: (res) => console.log("✅ Success! Node Backend Returned:", res),
      error: (err) => console.error("❌ Failed API Call", err)
    });
  }

  logout() {
    this.authService.logout();
  }
}
