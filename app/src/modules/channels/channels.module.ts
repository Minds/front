import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { MessengerModule } from '../messenger/messenger.module';
import { WireModule } from '../wire/wire.module';
import { OnboardingModule } from '../onboarding/onboarding.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';

import { ChannelModulesComponent } from './modules/modules';
import { ChannelSupporters } from './supporters/supporters';
import { ChannelSubscribers } from './subscribers/subscribers';
import { ChannelSubscriptions } from './subscriptions/subscriptions';
import { ChannelSocialProfiles } from './social-profiles/social-profiles';
import { ChannelComponent } from './channel.component';
import { ChannelsListComponent } from './list.component';
import { ChannelsTileComponent } from './tile/tile.component';

const routes: Routes = [
  { path: 'channels/:filter', component: ChannelsListComponent },
  { path: 'channels', redirectTo: '/channels/top', pathMatch: 'full' },
];

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    LegacyModule,
    MessengerModule,
    WireModule,
    OnboardingModule,
    NewsfeedModule,
  ],
  declarations: [
    ChannelModulesComponent,
    ChannelComponent,
    ChannelSupporters,
    ChannelSubscribers,
    ChannelSubscriptions,
    ChannelSocialProfiles,
    ChannelsListComponent,
    ChannelsTileComponent,
  ],
  exports: [
    ChannelModulesComponent,
    ChannelSupporters,
    ChannelSubscribers,
    ChannelSubscriptions,
    ChannelSocialProfiles,
  ],
  entryComponents: [
    ChannelComponent,
    ChannelsListComponent,
  ],
})
export class ChannelsModule {
}
