import { Route } from '@angular/router';

export const boostRoutes: Route[] = [
  {
    path: 'boost',
    loadChildren: () => import('./boost.module').then((m) => m.BoostModule),
  },
];
