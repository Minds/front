import { Route } from '@angular/router';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

export const WalletModuleLazyRoutes: Route = {
  path: 'wallet',
  loadChildren: () => import('./wallet.module').then((m) => m.WalletModule),
  canActivate: [MindsOnlyRedirectGuard],
};
