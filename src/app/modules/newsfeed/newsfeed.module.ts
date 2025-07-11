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
import { NewsfeedService } from './services/newsfeed.service';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NewsfeedEntityComponent } from './feeds/entity.component';
import { SearchSharedModule } from '../search/search-shared.module';
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
import { IfTenantDirective } from '~/common/directives/if-tenant.directive';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
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
    SearchSharedModule,
    ActivityModule,
    ComposerModule,
    DiscoverySharedModule,
    LanguageModule,
    OnboardingV3Module,
    LiquiditySpotModule,
    ExperimentsModule,
    CompassModule,
    VirtualScrollerModule,
    IfTenantDirective,
  ],
  declarations: [
    NewsfeedComponent,
    NewsfeedSingleComponent,
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
  providers: [NewsfeedService, FeedAlgorithmHistoryService],
  exports: [NewsfeedEntityComponent, NewsfeedComponent, FeedGridComponent],
})
export class NewsfeedModule {}
