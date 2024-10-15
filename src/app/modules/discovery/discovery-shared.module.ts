import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryTagSettingsComponent } from './tags/settings.component';
import { DiscoveryFeedsSettingsComponent } from './feeds/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscoveryFeedItemComponent } from './feeds/feed-item.component';
import { DiscoveryService } from './discovery.service';
import { DiscoveryTagButtonComponent } from './tags/tag-button/tag-button.component';
import { DiscoveryTagWidgetComponent } from './tags/tag-widget/tag-widget.component';
import { DiscoveryComponent } from './discovery.component';
import { DiscoveryTrendsComponent } from './trends/trends.component';
import { DiscoveryTrendsListItemComponent } from './trends/list-item.component';
import { DiscoverySearchComponent } from './search/search.component';
import { DiscoveryTagsComponent } from './tags/tags.component';
import { DiscoveryFeedsComponent } from './feeds/feeds.component';
import { DiscoveryFeedsListComponent } from './feeds/feeds-list.component';
import { DiscoverySettingsButtonComponent } from './settings-button/settings-button.component';
import { DiscoveryDisclaimerModule } from './disclaimer/disclaimer.module';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { DiscoveryNoTagsPromptComponent } from './tags/notags-prompt/notags-prompt.component';
import { DiscoveryPlusUpgradeComponent } from './plus-upgrade/plus-upgrade.component';
import { DiscoveryTabsComponent } from './tabs/tabs.component';
import { DiscoveryLatestFeedComponent } from './latest/latest.component';
import { DiscoveryCardCarouselComponent } from './card-carousel/card-carousel.component';
import { SuggestionsService } from '../suggestions/channel/channel-suggestions.service';
import { CardCarouselService } from './card-carousel/card-carousel.service';
import { WireModalService } from '../wire/wire-modal.service';
import { WirePaymentHandlersService } from '../wire/wire-payment-handlers.service';
import { DiscoveryTrendsService } from './trends/trends.service';
import { DiscoveryBuildYourAlgorithmComponent } from './build-your-algorithm/build-your-algorithm.component';
import { ExperimentsModule } from '../experiments/experiments.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { LiquiditySpotModule } from '../boost/liquidity-spot/liquidity-spot.module';
import { OnboardingV3Module } from '../onboarding-v3/onboarding.module';
import { LanguageModule } from '../language/language.module';
import { AdsModule } from '../ads/ads.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { DiscoveryEmptyGuestFeedNoticeComponent } from './empty-guest-feed-notice/empty-guest-feed-notice.component';
import { DiscoveryAdminExcludeButtonComponent } from './tags/admin-exclude-button/admin-exclude-button.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ActivityModule,
    ExperimentsModule,
    DiscoveryDisclaimerModule,
    SuggestionsModule,
    OnboardingV3Module,
    LiquiditySpotModule,
    LanguageModule,
    AdsModule,
  ],
  declarations: [
    DiscoverySidebarTagsComponent,
    DiscoveryAdminExcludeButtonComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedsSettingsComponent,
    DiscoveryFeedItemComponent,
    DiscoveryTagButtonComponent,
    DiscoveryTagWidgetComponent,

    DiscoveryComponent,
    DiscoveryTrendsComponent,
    DiscoveryTrendsListItemComponent,
    DiscoverySearchComponent,
    DiscoveryTagsComponent,
    DiscoveryFeedsComponent,
    DiscoveryFeedsListComponent,
    DiscoverySettingsButtonComponent,
    DiscoverySuggestionsComponent,
    DiscoveryNoTagsPromptComponent,
    DiscoveryPlusUpgradeComponent,
    DiscoveryTabsComponent,
    DiscoveryLatestFeedComponent,
    DiscoveryCardCarouselComponent,
    DiscoveryBuildYourAlgorithmComponent,
    DiscoveryEmptyGuestFeedNoticeComponent,
  ],
  exports: [
    DiscoverySidebarTagsComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedItemComponent,
    DiscoveryTagButtonComponent,
    DiscoveryTagWidgetComponent,
    DiscoveryComponent,
    DiscoveryTrendsComponent,
    DiscoverySearchComponent,
    DiscoveryTabsComponent,
    DiscoveryTagsComponent,
    DiscoveryFeedsComponent,
    DiscoverySidebarTagsComponent,
    DiscoveryBuildYourAlgorithmComponent,
    DiscoverySettingsButtonComponent,
    DiscoveryEmptyGuestFeedNoticeComponent,
  ],
  providers: [
    DiscoveryTrendsService,
    WirePaymentHandlersService,
    WireModalService,
    DiscoveryService,
    SuggestionsService,
    CardCarouselService,
    DiscoveryService,
  ],
})
export class DiscoverySharedModule {}
