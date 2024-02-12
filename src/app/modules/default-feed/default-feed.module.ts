import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule as NgFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { DefaultFeedComponent } from './feed/feed.component';
import { DefaultFeedContainerComponent } from './default-feed-container.component';
import { DiscoveryDisclaimerModule } from '../discovery/disclaimer/disclaimer.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { ExperimentsModule } from '../experiments/experiments.module';
import { NoticesModule } from '../notices/notices.module';
import { DefaultFeedHeaderComponent } from './feed/default-feed-header/default-feed-header.component';
import { ValuePropModule } from '../value-prop/value-prop.module';
import { DiscoverySharedModule } from '../discovery/discovery-shared.module';
import { TenantGuestModeFeedComponent } from './tenant-guest-mode-feed/tenant-guest-mode-feed.component';
import { ComposerModule } from '../composer/composer.module';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    CommonModule,
    ActivityModule,
    DiscoveryDisclaimerModule,
    SuggestionsModule,
    ExperimentsModule,
    NoticesModule,
    ValuePropModule,
    DiscoverySharedModule,
    ComposerModule,
    NewsfeedModule,
  ],
  declarations: [
    DefaultFeedComponent,
    DefaultFeedContainerComponent,
    DefaultFeedHeaderComponent,
    TenantGuestModeFeedComponent,
  ],
  exports: [
    DefaultFeedComponent,
    DefaultFeedContainerComponent,
    TenantGuestModeFeedComponent,
  ],
})
export class DefaultFeedModule {}
