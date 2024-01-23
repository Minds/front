import { LoggedInRedirectGuard } from '../../common/guards/logged-in-redirect.guard';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

export const UpgradeModuleLazyRoutes = {
  path: 'upgrade',
  loadChildren: () => import('./upgrade.module').then(m => m.UpgradeModule),
  canActivate: [MindsOnlyRedirectGuard, LoggedInRedirectGuard],
};
