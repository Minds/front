import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DiscoveryComponent } from './discovery.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { CommonModule } from '../../common/common.module';
import { DiscoveryTrendsComponent } from './trends/trends.component';
import { DiscoveryTrendsListItemComponent } from './trends/list-item.component';
import { DiscoveryTrendComponent } from './trends/trend/trend.component';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { DiscoverySearchComponent } from './search/search.component';
import { DiscoveryTagsComponent } from './tags/tags.component';
import { DiscoveryTrendsService } from './trends/trends.service';
import { LegacyModule } from '../legacy/legacy.module';
import { DiscoverySharedModule } from './discovery-shared.module';
import { DiscoveryFeedsComponent } from './feeds/feeds.component';
import { DiscoverySettingsButtonComponent } from './settings-button/settings-button.component';
import { DiscoveryDisclaimerComponent } from './disclaimer/disclaimer.component';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { DiscoveryNoTagsPromptComponent } from './tags/notags-prompt/notags-prompt.component';
import { DiscoveryFeedsListComponent } from './feeds/feeds-list.component';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { LanguageModule } from '../language/language.module';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryPlusUpgradeComponent } from './plus-upgrade/plus-upgrade.component';
import { WirePaymentHandlersService } from '../wire/wire-payment-handlers.service';
import { WireModalService } from '../wire/wire-modal.service';
import { DiscoveryService } from './discovery.service';
import { DiscoveryBoostFeedComponent } from './boost/boost-feed.component';
import { DiscoveryTabsComponent } from './tabs/tabs.component';
import { DiscoveryFeedsService } from './feeds/feeds.service';
import { FeedsService } from '../../common/services/feeds.service';
import { DiscoveryLatestFeedComponent } from './latest/latest.component';
import { DiscoverySuggestionsCarouselComponent } from './suggestions-carousel/suggestions-carousel.component';
import { SuggestionsService } from '../suggestions/channel/channel-suggestions.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: DiscoveryComponent,
        children: [
          { path: '', redirectTo: 'overview' },
          {
            path: 'overview',
            component: DiscoveryTrendsComponent,
            data: {
              title: 'Discovery / Overview',
              ogImage: '/assets/og-images/discovery.png',
              ogImageWidth: 400,
              ogImageHeight: 76,
            },
          },
          {
            path: 'trend/:guid',
            component: DiscoveryTrendComponent,
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
                redirectTo: 'your',
              },
              {
                path: ':type',
                component: DiscoveryTagsComponent,
                data: {
                  title: 'Discovery / Tags',
                },
              },
            ],
          },
          {
            path: 'boost/feed',
            component: DiscoveryBoostFeedComponent,
            data: {
              title: 'Discovery / Boosted',
            },
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
              { path: '', redirectTo: 'preferred' },
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
              { path: '', redirectTo: 'user' },
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
            children: [
              { path: '', redirectTo: 'overview' },
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
                component: DiscoveryTrendComponent,
                data: { plus: true },
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
                component: DiscoveryTagsComponent,
                data: { plus: true },
              },
              {
                path: 'feeds',
                children: [
                  { path: '', redirectTo: 'preferred' },
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
    LegacyModule, // For subscribe button
    // GroupsModule,
    DiscoverySharedModule,
    HashtagsModule,
    LanguageModule,
    RouterModule,
  ],
  providers: [
    DiscoveryTrendsService,
    WirePaymentHandlersService,
    WireModalService,
    DiscoveryService,
    SuggestionsService,
  ],
  declarations: [
    DiscoveryComponent,
    DiscoveryTrendsComponent,
    DiscoveryTrendsListItemComponent,
    DiscoveryTrendComponent,
    DiscoverySearchComponent,
    DiscoveryTagsComponent,
    DiscoveryFeedsComponent,
    DiscoveryFeedsListComponent,
    DiscoverySettingsButtonComponent,
    DiscoveryDisclaimerComponent,
    DiscoverySuggestionsComponent,
    DiscoveryNoTagsPromptComponent,
    DiscoveryPlusUpgradeComponent,
    DiscoveryBoostFeedComponent,
    DiscoveryTabsComponent,
    DiscoveryLatestFeedComponent,
    DiscoverySuggestionsCarouselComponent,
  ],
  exports: [
    DiscoveryComponent,
    DiscoveryTrendsComponent,
    DiscoverySearchComponent,
    DiscoveryTagsComponent,
    DiscoveryBoostFeedComponent,
    DiscoveryFeedsComponent,
    DiscoverySidebarTagsComponent,
  ],
})
export class DiscoveryModule {}
