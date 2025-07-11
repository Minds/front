import { Route } from '@angular/router';

export const devtoolRoutes: Route[] = [
  {
    path: 'devtools',
    loadComponent: () =>
      import('./environment-selector/environment-selector.component').then(
        (c) => c.EnvironmentSelectorComponent
      ),
  },
];
