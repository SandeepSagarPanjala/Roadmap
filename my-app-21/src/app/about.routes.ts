import { Routes } from '@angular/router';
import { AboutBangalorePage } from './pages/about-bangalore.page';
import { AboutHyderabadPage } from './pages/about-hyderabad.page';

export const ABOUT_ROUTES: Routes = [
  {
    path: 'bangalore',
    component: AboutBangalorePage,
  },
  {
    path: 'hyderabad',
    component: AboutHyderabadPage,
  },
];
