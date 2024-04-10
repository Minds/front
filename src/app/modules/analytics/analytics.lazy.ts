import { Route } from '@angular/router';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

export const AnalyticsModuleLazyRoutes: Route = {
  path: 'analytics',
  loadChildren: () =>
    import('./analytics.module').then((m) => m.AnalyticsModule),
  canActivate: [MindsOnlyRedirectGuard],
};
