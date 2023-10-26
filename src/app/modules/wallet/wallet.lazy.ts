import { Route } from '@angular/router';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

export const WalletModuleLazyRoutes: Route = {
  path: 'wallet',
  loadChildren: () => import('./wallet.module').then(m => m.WalletModule),
  canActivate: [TenantRedirectGuard],
};
