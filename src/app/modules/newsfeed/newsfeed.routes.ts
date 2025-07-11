import { Routes } from '@angular/router';
import { NewsfeedComponent } from './newsfeed.component';
import { PathMatch } from '~/common/types/angular.types';
import { NewsfeedGqlComponent } from './feeds/newsfeed-gql.component';
import { FeedAlgorithmRedirectGuard } from './guards/feed-algorithm-redirect-guard';
import { CanDeactivateGuardService } from '~/services/can-deactivate-guard';
import { NewsfeedSingleComponent } from './single/single.component';

export const newsfeedRoutes: Routes = [
  {
    path: 'newsfeed',
    component: NewsfeedComponent,
    children: [
      { path: '', redirectTo: 'subscriptions', pathMatch: 'full' as PathMatch },
      { path: 'suggested', redirectTo: 'subscriptions' },
      { path: 'top', redirectTo: 'global/top', pathMatch: 'full' as PathMatch },
      {
        path: 'global',
        redirectTo: 'global/top',
        pathMatch: 'full' as PathMatch,
      },
      { path: 'global/:algorithm', redirectTo: 'subscriptions' },
      {
        path: 'subscribed',
        redirectTo: 'subscriptions',
        pathMatch: 'full' as PathMatch,
      },
      {
        path: 'subscriptions',
        component: NewsfeedGqlComponent,
        pathMatch: 'full' as PathMatch,
        canActivate: [FeedAlgorithmRedirectGuard],
      },
      {
        path: 'subscriptions/:algorithm',
        component: NewsfeedGqlComponent,
        canDeactivate: [CanDeactivateGuardService],
        data: {
          title: 'Newsfeed',
          description: 'Posts from channels your subscribe to',
          ogImage: '/assets/og-images/newsfeed-v3.png',
          ogImageWidth: 1200,
          ogImageHeight: 1200,
        },
      },
    ],
  },
  { path: 'newsfeed/:guid', component: NewsfeedSingleComponent },
];
