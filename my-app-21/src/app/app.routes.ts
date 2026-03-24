import { Routes } from '@angular/router';
import { ABOUT_ROUTES } from './about.routes';
import { AboutPage } from './pages/about.page';
import { ContactPage } from './pages/contact.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  {
    path: 'about',
    component: AboutPage,
    children: ABOUT_ROUTES,
  },
  {
    path: 'contact',
    component: ContactPage,
  },
];
