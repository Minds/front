import { MindsOnlyRedirectGuard } from '~/common/guards/minds-only-redirect.guard';
import { YoutubeMigrationMarketingComponent } from './youtube-migration/marketing/marketing.component';
import { Routes } from '@angular/router';

export const mediaRoutes: Routes = [
  { path: 'media/videos/:filter', redirectTo: 'newsfeed/global/top' },
  {
    path: 'media/videos',
    redirectTo: 'newsfeed/global/top',
  },
  { path: 'media/images/:filter', redirectTo: 'newsfeed/global/top' },
  {
    path: 'media/images',
    redirectTo: 'newsfeed/global/top',
  },

  { path: 'media/:container/:guid', redirectTo: 'newsfeed/:guid' },
  { path: 'media/:guid', redirectTo: 'newsfeed/:guid' },

  {
    path: 'youtube-migration',
    component: YoutubeMigrationMarketingComponent,
    canActivate: [MindsOnlyRedirectGuard],
    data: {
      preventLayoutReset: true,
    },
  },

  /* Legacy routes */
  { path: 'archive/view/:container/:guid', redirectTo: 'newsfeed/:guid' },
  { path: 'archive/view/:guid', redirectTo: 'newsfeed/:guid' },
];
