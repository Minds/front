import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { VideoChatModule } from '../videochat/videochat.module';

import { GroupsJoinButton } from './groups-join-button';
import { GroupsProfileMembersInvite } from './profile/members/invite/invite';
import { GroupsCard } from './card/card';
import { GroupsCardUserActionsButton } from './profile/card-user-actions-button';
import { GroupsSettingsButton } from './profile/groups-settings-button';
import { GroupsProfileMembers } from './profile/members/members';
import { GroupsProfileRequests } from './profile/requests/requests';
import { GroupsProfileFilterSelector } from './profile/filter-selector/filter-selector.component';
import { GroupsMembersModuleComponent } from './members/members';
import { GroupsTileComponent } from './tile/tile.component';
import { GroupsSidebarMarkersComponent } from './sidebar-markers/sidebar-markers.component';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { GroupMemberPreviews } from './profile/member-previews/member-previews.component';
import { CanDeactivateGroupService } from './profile/can-deactivate/can-deactivate-group.service';
import { GroupProfileFeedComponent } from './profile/feed/feed.component';
import { GroupProfileFeedSortedComponent } from './profile/feed/sorted.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { GroupsProfileReviewComponent } from './profile/review/review.component';
import { GroupsKickModalComponent } from './kick-modal/kick-modal.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { ComposerModule } from '../composer/composer.module';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { GroupsProfile } from './profile/profile';
import { GroupsCreator } from './create/create';
import { GroupsMembershipsComponent } from './memberships/memberships.component';
import { GroupsSearchService } from './profile/feed/search.service';

const routes: Routes = [
  {
    path: 'groups/profile/:guid',
    component: GroupsProfile,
    canDeactivate: [CanDeactivateGroupService],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed/review', component: GroupsProfileReviewComponent },
      { path: 'feed/:filter', component: GroupProfileFeedComponent },
      { path: 'feed', component: GroupProfileFeedComponent },
      { path: 'activity', redirectTo: 'feed' },
      { path: 'members', component: GroupsProfileMembers },
      { path: 'requests', component: GroupsProfileRequests },
    ],
  },
  {
    path: 'groups/create',
    component: GroupsCreator,
    data: {
      title: 'Create a group',
    },
  },
  {
    path: 'groups/memberships',
    component: GroupsMembershipsComponent,
    data: {
      title: 'Memberships',
    },
  },
  { path: 'groups', redirectTo: '/groups/memberships', pathMatch: 'full' },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    LegacyModule,
    ModalsModule,
    HashtagsModule,
    TextInputAutocompleteModule,
    VideoChatModule,
    NewsfeedModule,
    ComposerModule,
    ActivityModule,
  ],
  declarations: [
    GroupsProfile,
    GroupsCreator,
    GroupsJoinButton,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupProfileFeedComponent,
    GroupProfileFeedSortedComponent,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsProfileFilterSelector,
    GroupsMembersModuleComponent,
    GroupsTileComponent,
    GroupMemberPreviews,
    GroupsSidebarMarkersComponent,
    GroupsProfileReviewComponent,
    GroupsKickModalComponent,
    GroupsMembershipsComponent,
  ],
  exports: [
    GroupsProfile,
    GroupsCreator,
    GroupsJoinButton,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsProfileFilterSelector,
    GroupsMembersModuleComponent,
    GroupsSidebarMarkersComponent,
  ],
  providers: [CanDeactivateGroupService, GroupsSearchService],
})
export class GroupsModule {}
