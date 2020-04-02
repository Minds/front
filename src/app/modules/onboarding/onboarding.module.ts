import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { TokenOnboardingModule } from '../wallet/tokens/onboarding/onboarding.module';
import { MessengerModule } from '../messenger/messenger.module';
import { OnboardingCardComponent } from './card/card.component';
import { OnboardingFeedComponent } from './feed.component';
import { OnboardingService } from './onboarding.service';
import { OnboardingModalComponent } from './modal.component';
import { ChannelOnboardingService } from './channel/onboarding.service';
import { TopicsOnboardingComponent } from './channel/topics/topics.component';
import { ChannelOnboardingComponent } from './channel/onboarding.component';
import { SubscriptionsOnboardingComponent } from './channel/subscriptions/subscriptions.component';
import { ChannelsTileComponent } from '../channels/tile/tile.component';
import { GroupsOnboardingComponent } from './channel/groups/groups.component';
import { GroupsTileComponent } from '../groups/tile/tile.component';
import { ChannelSetupOnboardingComponent } from './channel/channel/channel.component';
import { TokenRewardsOnboardingComponent } from './channel/rewards/rewards.component';
import { Client } from '../../services/api/client';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { Session } from '../../services/session';
import { FeaturesService } from '../../services/features.service';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([]),
    CommonModule,
    TokenOnboardingModule,
    MessengerModule,
    SuggestionsModule,
  ],
  declarations: [
    OnboardingCardComponent,
    OnboardingFeedComponent,
    OnboardingModalComponent,
    ChannelOnboardingComponent,
    TopicsOnboardingComponent,
    SubscriptionsOnboardingComponent,
    GroupsOnboardingComponent,
    ChannelSetupOnboardingComponent,
    TokenRewardsOnboardingComponent,
  ],
  providers: [
    OnboardingService,
    {
      provide: ChannelOnboardingService,
      deps: [Client, Session, FeaturesService],
      useFactory: ChannelOnboardingService._,
    },
  ],
  exports: [
    OnboardingCardComponent,
    OnboardingFeedComponent,
    ChannelOnboardingComponent,
  ],
  entryComponents: [
    OnboardingModalComponent,
    TopicsOnboardingComponent,
    SubscriptionsOnboardingComponent,
    ChannelsTileComponent,
    GroupsTileComponent,
    GroupsOnboardingComponent,
    ChannelSetupOnboardingComponent,
    TokenRewardsOnboardingComponent,
  ],
})
export class OnboardingModule {}
