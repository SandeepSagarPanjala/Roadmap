import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <section class="page">
      <h1>About Us</h1>
      <p>
        This is the About page. You can use this page to explain your company, mission, and what
        your application does.
      </p>

      <div class="mt-8 flex flex-wrap gap-3">
        <a
          routerLink="bangalore"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          About Bangalore
        </a>
        <a
          routerLink="hyderabad"
          class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          About Hyderabad
        </a>
      </div>

      <div class="mt-8 rounded-md border border-slate-200 bg-white p-4">
        <router-outlet />
      </div>
    </section>
  `,
})
export class AboutPage {}
