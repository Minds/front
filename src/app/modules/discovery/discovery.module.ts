import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscoveryComponent } from './discovery.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommonModule } from '../../common/common.module';
import { DiscoveryTrendsComponent } from './trends/trends.component';
import { DiscoverySearchComponent } from './search/search.component';
import { DiscoveryTagsComponent } from './tags/tags.component';
import { DiscoverySharedModule } from './discovery-shared.module';
import { DiscoveryFeedsComponent } from './feeds/feeds.component';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { LanguageModule } from '../language/language.module';
import { DiscoveryLatestFeedComponent } from './latest/latest.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { ContentSettingsModule } from '../content-settings/content-settings.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { PathMatch } from '../../common/types/angular.types';
import { SearchComponent } from '../search/search.component';
import { TenantRedirectGuard } from '../../common/guards/tenant-redirect.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiscoveryComponent,
        pathMatch: 'prefix' as PathMatch,
        children: [
          {
            path: '',
            redirectTo: 'trending',
            pathMatch: 'full' as PathMatch,
          },
          {
            path: 'overview',
            redirectTo: '/newsfeed/subscriptions/for-you',
          },
          {
            path: 'trend/:guid',
            redirectTo: '/newsfeed/:guid',
          },
          {
            path: 'trending',
            component: SearchComponent,
            data: { explore: true },
          },
          {
            path: 'search',
            component: DiscoverySearchComponent,
          },
          {
            path: 'tags',
            children: [
              {
                path: '',
                redirectTo: 'trending',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: 'your',
                redirectTo: '/newsfeed/subscriptions/for-you',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: ':type',
                component: DiscoveryTagsComponent,
                data: {
                  title: 'Discovery / Trending Tags',
                },
              },
            ],
          },
          {
            path: 'boost/feed',
            redirectTo: '/boost/boost-console',
          },
          {
            // deprecated route.
            path: 'supermind',
            redirectTo: '/supermind/explore',
          },
          {
            path: 'memberships/feed',
            component: DiscoveryLatestFeedComponent,
            data: {
              title: 'Discovery / Memberships',
              memberships: true,
            },
          },
          {
            path: 'feeds',
            children: [
              {
                path: '',
                redirectTo: 'preferred',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: 'preferred',
                component: DiscoveryFeedsComponent,
              },
              {
                path: 'trending',
                component: DiscoveryFeedsComponent,
              },
            ],
          },
          {
            path: 'suggestions',
            children: [
              { path: '', redirectTo: 'user', pathMatch: 'full' as PathMatch },
              {
                path: 'user',
                component: DiscoverySuggestionsComponent,
              },
              {
                path: 'group',
                component: DiscoverySuggestionsComponent,
              },
            ],
          },
          {
            path: 'plus',
            data: { plus: true },
            canActivate: [TenantRedirectGuard],
            children: [
              {
                path: '',
                redirectTo: 'overview',
                pathMatch: 'full' as PathMatch,
              },
              {
                path: 'overview',
                component: DiscoveryTrendsComponent,
                data: {
                  title: 'Minds+ / Overview',
                  plus: true,
                },
              },
              {
                path: 'trend/:guid',
                redirectTo: '/newsfeed/:guid',
              },
              {
                path: 'latest/feed',
                component: DiscoveryLatestFeedComponent,
                data: {
                  title: 'Minds+ / Latest',
                  plus: true,
                },
              },
              {
                path: 'search',
                component: DiscoverySearchComponent,
                data: { plus: true },
              },
              {
                path: 'tags',
                children: [
                  {
                    path: '',
                    redirectTo: 'your',
                    pathMatch: 'full' as PathMatch,
                  },
                  {
                    path: ':type',
                    component: DiscoveryTagsComponent,
                    data: {
                      title: 'Your Tags',
                      data: { plus: true },
                    },
                  },
                ],
              },
              {
                path: 'feeds',
                children: [
                  {
                    path: '',
                    redirectTo: 'preferred',
                    pathMatch: 'full' as PathMatch,
                  },
                  {
                    path: 'preferred',
                    component: DiscoveryFeedsComponent,
                    data: { plus: true },
                  },
                  {
                    path: 'trending',
                    component: DiscoveryFeedsComponent,
                    data: { plus: true },
                  },
                ],
              },
            ],
          },
        ],
      },
    ]),
    NgCommonModule,
    CommonModule,
    SuggestionsModule,
    ActivityModule,
    DiscoverySharedModule,
    HashtagsModule,
    LanguageModule,
    RouterModule,
    NewsfeedModule,
    ContentSettingsModule,
  ],
})
export class DiscoveryModule {}
