import { Routes } from '@angular/router';
import { PathMatch } from '~/common/types/angular.types';

export const searchRoutes: Routes = [
  {
    path: 'search',
    loadComponent: () =>
      import('./search.component').then((c) => c.SearchComponent),
    pathMatch: 'full' as PathMatch,
  },
];
