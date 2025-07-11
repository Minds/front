import { Routes } from '@angular/router';
import { RedirectGuard } from '../../services/redirect-guard';

const REDIRECT_URL = 'https://jobs.lever.co/minds/';

export const jobRoutes: Routes = [
  {
    path: 'jobs',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: REDIRECT_URL,
    },
  },
  {
    path: 'careers',
    canActivate: [RedirectGuard],
    component: RedirectGuard,
    data: {
      externalUrl: REDIRECT_URL,
    },
  },
];
