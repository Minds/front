import { Routes } from '@angular/router';

export const i18nRoutes: Routes = [
  {
    path: 'localization',
    loadComponent: () =>
      import('./marketing.component').then((c) => c.I18nMarketingComponent),
    data: {
      title: 'Localization',
      description: 'Help translate Minds into every global language',
      ogImage: '/assets/photos/night-sky.jpg',
    },
  },
];
