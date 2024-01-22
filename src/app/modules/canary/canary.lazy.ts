import { Route } from '@angular/router';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

export const CanaryModuleLazyRoutes: Route = {
  path: 'canary',
  loadChildren: () => import('./canary.module').then(m => m.CanaryModule),
  canActivate: [MindsOnlyRedirectGuard],
};
