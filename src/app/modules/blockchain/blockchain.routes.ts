import { Route } from '@angular/router';

export const blockchainRoutes: Route[] = [
  {
    path: 'reward',
    redirectTo: 'rewards',
  },
  {
    path: 'rewards',
    loadChildren: () =>
      import('./marketing/marketing.module').then(
        (m) => m.BlockchainMarketingModule
      ),
  },
];
