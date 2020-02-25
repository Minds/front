import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { MessengerModule } from '../messenger/messenger.module';
import { WireModule } from '../wire/wire.module';
import { OnboardingModule } from '../onboarding/onboarding.module';

import { ChannelModulesComponent } from './modules/modules';
import { ChannelSupporters } from './supporters/supporters';
import { ChannelSubscribers } from './subscribers/subscribers';
import { ChannelSubscriptions } from './subscriptions/subscriptions';
import { ChannelSidebar } from './sidebar/sidebar';
import { ChannelFeedComponent } from './feed/feed';
import { ChannelSocialProfiles } from './social-profiles/social-profiles';
import { ChannelComponent } from './channel.component';
import { ChannelsTileComponent } from './tile/tile.component';
import { PosterModule } from '../newsfeed/poster/poster.module';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { ChannelSortedComponent } from './sorted/sorted.component';
import { ChannelSortedModuleComponent } from './sorted/module.component';
import { ReferralsModule } from '../wallet/tokens/referrals/referrals.module';

const routes: Routes = [
  { path: 'channels', redirectTo: '/newsfeed/global/top', pathMatch: 'full' },
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
    PosterModule,
    NewsfeedModule,
    HashtagsModule,
    ReferralsModule,
  ],
  declarations: [
    ChannelModulesComponent,
    ChannelComponent,
    ChannelSupporters,
    ChannelSubscribers,
    ChannelSubscriptions,
    ChannelSocialProfiles,
    ChannelsTileComponent,
    ChannelFeedComponent,
    ChannelSidebar,
    ChannelSortedComponent,
    ChannelSortedModuleComponent,
  ],
  exports: [
    ChannelModulesComponent,
    ChannelSupporters,
    ChannelSubscribers,
    ChannelSubscriptions,
    ChannelSocialProfiles,
    ChannelFeedComponent,
    ChannelSidebar,
    ChannelComponent,
  ],
  entryComponents: [ChannelComponent],
})
export class ChannelsModule {}
