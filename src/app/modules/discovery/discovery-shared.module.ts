import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';
import { DiscoveryTagsService } from './tags/tags.service';
import { DiscoverySidebarTagsComponent } from './tags/sidebar-tags.component';
import { DiscoveryTagSettingsComponent } from './tags/settings.component';
import { DiscoveryFeedsSettingsComponent } from './feeds/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscoveryFeedItemComponent } from './feeds/feed-item.component';
import { LegacyModule } from '../legacy/legacy.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
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
import { DiscoveryDisclaimerComponent } from './disclaimer/disclaimer.component';
import { DiscoverySuggestionsComponent } from './suggestions/suggestions.component';
import { DiscoveryNoTagsPromptComponent } from './tags/notags-prompt/notags-prompt.component';
import { DiscoveryPlusUpgradeComponent } from './plus-upgrade/plus-upgrade.component';
import { DiscoveryBoostFeedComponent } from './boost/boost-feed.component';
import { DiscoveryTabsComponent } from './tabs/tabs.component';
import { DiscoveryLatestFeedComponent } from './latest/latest.component';
import { DiscoveryCardCarouselComponent } from './card-carousel/card-carousel.component';
import { SuggestionsService } from '../suggestions/channel/channel-suggestions.service';
import { CardCarouselService } from './card-carousel/card-carousel.service';
import { WireModalService } from '../wire/wire-modal.service';
import { WirePaymentHandlersService } from '../wire/wire-payment-handlers.service';
import { DiscoveryTrendsService } from './trends/trends.service';
import { DiscoveryTrendComponent } from './trends/trend/trend.component';
import { DiscoveryBuildYourAlgorithmComponent } from './build-your-algorithm/build-your-algorithm.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LegacyModule,
    ActivityModule,
  ],
  declarations: [
    DiscoverySidebarTagsComponent,
    DiscoveryTagSettingsComponent,
    DiscoveryFeedsSettingsComponent,
    DiscoveryFeedItemComponent,
    DiscoveryTagButtonComponent,
    DiscoveryTagWidgetComponent,

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
    DiscoveryCardCarouselComponent,
    DiscoveryBuildYourAlgorithmComponent,
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
    DiscoveryTagsComponent,
    DiscoveryBoostFeedComponent,
    DiscoveryFeedsComponent,
    DiscoverySidebarTagsComponent,
    DiscoveryBuildYourAlgorithmComponent,
  ],
  providers: [
    DiscoveryTrendsService,
    WirePaymentHandlersService,
    WireModalService,
    DiscoveryService,
    SuggestionsService,
    CardCarouselService,
    DiscoveryTagsService,
    DiscoveryService,
  ],
})
export class DiscoverySharedModule {}
