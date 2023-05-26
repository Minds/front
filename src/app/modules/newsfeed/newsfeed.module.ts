import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { AdsModule } from '../ads/ads.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { NoticesModule } from '../notices/notices.module';
import { NewsfeedComponent } from './newsfeed.component';
import { NewsfeedSingleComponent } from './single/single.component';
import { NewsfeedBoostRotatorComponent } from './boost-rotator/boost-rotator.component';
import { NewsfeedSubscribedComponent } from './feeds/subscribed.component';
import { NewsfeedService } from './services/newsfeed.service';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NewsfeedEntityComponent } from './feeds/entity.component';
import { SearchModule } from '../search/search.module';
import { FeedGridComponent } from './feed-grid/feed-grid.component';
import { ComposerModule } from '../composer/composer.module';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { LanguageModule } from '../language/language.module';
import { OnboardingV3Module } from '../onboarding-v3/onboarding.module';
import { LiquiditySpotModule } from '../boost/liquidity-spot/liquidity-spot.module';
import { NewsfeedActivitySuggestionsComponent } from './suggestions/suggestions.component';
import { ExperimentsModule } from '../experiments/experiments.module';
import { CompassModule } from '../compass/compass.module';
import { TopHighlightsComponent } from './feeds/top-highlights/top-highlights.component';
import { FeedAlgorithmHistoryService } from './services/feed-algorithm-history.service';
import { FeedAlgorithmRedirectGuard } from './guards/feed-algorithm-redirect-guard';
import { ActivityModule } from './activity/activity.module';
import { NewsfeedFeedItemComponent } from './feeds/feed-item.component';
import { VirtualMinimapComponent } from './feed/virtual-minimap';
import { FeedComponent } from './feed/feed.component';
import { VirtualScrollerModule } from './feed/virtual-scroller';
import { PathMatch } from '../../common/types/angular.types';
import { NewsfeedTabsComponent } from './feeds/tabs/tabs.component';
import { NewsfeedGqlComponent } from './feeds/newsfeed-gql.component';

const routes: Routes = [
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
        //component: NewsfeedSubscribedComponent,
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

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    ModalsModule,
    MindsFormsModule,
    AdsModule,
    HashtagsModule,
    SuggestionsModule,
    NoticesModule,
    SearchModule,
    ActivityModule,
    ComposerModule,
    DiscoverySharedModule,
    LanguageModule,
    OnboardingV3Module,
    LiquiditySpotModule,
    ExperimentsModule,
    CompassModule,
    VirtualScrollerModule,
  ],
  declarations: [
    NewsfeedComponent,
    NewsfeedSingleComponent,
    NewsfeedBoostRotatorComponent,
    NewsfeedSubscribedComponent,
    NewsfeedEntityComponent,
    FeedGridComponent,
    NewsfeedActivitySuggestionsComponent,
    TopHighlightsComponent,
    NewsfeedFeedItemComponent,
    VirtualMinimapComponent,
    FeedComponent,
    NewsfeedTabsComponent,
    NewsfeedGqlComponent,
  ],
  providers: [
    NewsfeedService,
    FeedAlgorithmHistoryService,
    FeedAlgorithmRedirectGuard,
  ],
  exports: [
    NewsfeedBoostRotatorComponent,
    NewsfeedEntityComponent,
    NewsfeedComponent,
    FeedGridComponent,
  ],
})
export class NewsfeedModule {}
