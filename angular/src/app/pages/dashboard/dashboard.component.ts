import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth/auth.service';
import { ExoplanetService } from '../../core/services/exoplanet/exoplanet.service';
import { Exoplanet } from '../../core/graphql/schema.generated';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private exoplanetService = inject(ExoplanetService);

  public readonly exoplanets = signal<Exoplanet[]>([]);
  public readonly loading = signal<boolean>(true);

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading.set(true);
    this.exoplanetService.getAllExoplanets().subscribe({
      next: (data) => {
        this.exoplanets.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error("❌ Failed to fetch Exoplanets via GraphQL CodeGen API", err);
        this.loading.set(false);
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
