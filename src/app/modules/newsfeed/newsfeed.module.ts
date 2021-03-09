import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
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
import { NewsfeedBoostComponent } from './feeds/boost.component';
import { NewsfeedService } from './services/newsfeed.service';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NewsfeedTagsComponent } from './feeds/tags/tags.component';
import { NewsfeedSortedComponent } from './feeds/sorted.component';
import { NewsfeedEntityComponent } from './feeds/entity.component';
import { SearchModule } from '../search/search.module';
import { NewsfeedTilesComponent } from './feeds/tiles.component';
import { ActivityModule } from './activity/activity.module';
import { FeedGridComponent } from './feed-grid/feed-grid.component';
import { ComposerModule } from '../composer/composer.module';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { LanguageModule } from '../language/language.module';
import { OnboardingV3Module } from '../onboarding-v3/onboarding.module';
import { LiquiditySpotModule } from '../boost/liquidity-spot/liquidity-spot.module';
import { NewsfeedActivitySuggestionsComponent } from './suggestions/suggestions.component';

const routes: Routes = [
  {
    path: 'newsfeed',
    component: NewsfeedComponent,
    children: [
      { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
      { path: 'suggested', redirectTo: 'subscriptions' },
      { path: 'top', redirectTo: 'global/top', pathMatch: 'full' },
      { path: 'global', redirectTo: 'global/top', pathMatch: 'full' },
      { path: 'global/:algorithm', redirectTo: 'subscriptions' },
      { path: 'subscribed', redirectTo: 'subscriptions', pathMatch: 'full' },
      {
        path: 'subscriptions',
        component: NewsfeedSubscribedComponent,
        canDeactivate: [CanDeactivateGuardService],
        data: {
          title: 'Newsfeed',
          description: 'Posts from channels your subscribe to',
          ogImage: '/assets/og-images/newsfeed.png',
          ogImageWidth: 400,
          ogImageHeight: 76,
        },
      },
      {
        path: 'boost',
        component: NewsfeedBoostComponent,
        canDeactivate: [CanDeactivateGuardService],
        data: {
          title: 'Boost Feed',
          description: 'Posts that have been boosted on the network',
          ogImage: '/assets/og-images/boost.png',
          ogImageWidth: 400,
          ogImageHeight: 76,
        },
      },
      { path: 'tag/:tag', component: NewsfeedTagsComponent },
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
    LegacyModule,
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
  ],
  declarations: [
    NewsfeedComponent,
    NewsfeedSingleComponent,
    NewsfeedBoostRotatorComponent,
    NewsfeedSubscribedComponent,
    NewsfeedBoostComponent,
    NewsfeedTagsComponent,
    NewsfeedSortedComponent,
    NewsfeedEntityComponent,
    NewsfeedTilesComponent,
    FeedGridComponent,
    NewsfeedActivitySuggestionsComponent,
  ],
  providers: [NewsfeedService],
  exports: [
    NewsfeedBoostRotatorComponent,
    NewsfeedEntityComponent,
    NewsfeedTilesComponent,
    NewsfeedComponent,
    FeedGridComponent,
  ],
})
export class NewsfeedModule {}
