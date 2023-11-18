import { LoggedInRedirectGuard } from '../../common/guards/logged-in-redirect.guard';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

export const UpgradeModuleLazyRoutes = {
  path: 'upgrade',
  loadChildren: () => import('./upgrade.module').then(m => m.UpgradeModule),
  canActivate: [TenantRedirectGuard, LoggedInRedirectGuard],
};
