import { Routes } from '@angular/router';

import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

export const brandingRoutes: Routes = [
  {
    path: 'branding',
    loadComponent: () =>
      import('./branding.component').then((c) => c.BrandingComponent),
    canActivate: [MindsOnlyRedirectGuard],
    data: {
      title: 'Branding',
      description: 'Logos, assets and styling guides',
      ogImage: '/assets/og-images/branding-v3.png',
      ogImageWidth: 1200,
      ogImageHeight: 1200,
    },
  },
];
