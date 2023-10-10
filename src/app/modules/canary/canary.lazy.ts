import { Route } from '@angular/router';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

export const CanaryModuleLazyRoutes: Route = {
  path: 'canary',
  loadChildren: () => import('./canary.module').then(m => m.CanaryModule),
  canActivate: [TenantRedirectGuard],
};
