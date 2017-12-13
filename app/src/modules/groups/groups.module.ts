import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ChannelsModule } from '../channels/channels.module';
import { ModalsModule } from '../modals/modals.module';

import { GroupsListComponent, GroupsProfile, GroupsCreator } from './list.component';
import { GroupsJoinButton } from './groups-join-button';
import { GroupsProfileMembersInvite } from './profile/members/invite/invite';
import { GroupsCard } from './card/card';
import { GroupsCardUserActionsButton } from './profile/card-user-actions-button';
import { GroupsSettingsButton } from './profile/groups-settings-button';
import { GroupsProfileMembers } from './profile/members/members';
import { GroupsProfileRequests } from './profile/requests/requests';
import { GroupsProfileFeed } from './profile/feed/feed';
import { GroupsProfileConversation } from './profile/conversation/conversation.component';
import { GroupsProfileFilterSelector } from './profile/filter-selector/filter-selector.component';
import { GroupsMembersModuleComponent } from './members/members';
import { GroupsTileComponent } from './tile/tile.component';

const routes: Routes = [
  { path: 'groups/profile/:guid/:filter', component: GroupsProfile },
  { path: 'groups/profile/:guid', component: GroupsProfile },
  { path: 'groups/create', component: GroupsCreator },
  { path: 'groups/:filter', component: GroupsListComponent },
  { path: 'groups', redirectTo: '/groups/top', pathMatch: 'full' },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LegacyModule,
    ChannelsModule,
    ModalsModule
  ],
  declarations: [
    GroupsListComponent,
    GroupsProfile,
    GroupsCreator,
    GroupsJoinButton,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupsProfileFeed,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsProfileConversation,
    GroupsProfileFilterSelector,
    GroupsMembersModuleComponent,
    GroupsTileComponent,
  ],
  exports: [
    GroupsListComponent,
    GroupsProfile,
    GroupsCreator,
    GroupsJoinButton,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupsProfileFeed,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsProfileConversation,
    GroupsProfileFilterSelector,
    GroupsMembersModuleComponent
  ],
  entryComponents: [
    GroupsCard
  ]
})
export class GroupsModule {
}
