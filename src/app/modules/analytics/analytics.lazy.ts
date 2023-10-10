import { Route } from '@angular/router';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

export const AnalyticsModuleLazyRoutes: Route = {
  path: 'analytics',
  loadChildren: () => import('./analytics.module').then(m => m.AnalyticsModule),
  canActivate: [TenantRedirectGuard],
};
