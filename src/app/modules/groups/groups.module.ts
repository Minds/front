import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { VideoChatModule } from '../videochat/videochat.module';

import { GroupsProfileMembersInvite } from './profile/members/invite/invite';
import { GroupsCard } from './card/card';
import { GroupsCardUserActionsButton } from './profile/card-user-actions-button';
import { GroupsSettingsButton } from './profile/groups-settings-button';
import { GroupsProfileMembers } from './profile/members/members';
import { GroupsProfileRequests } from './profile/requests/requests';
import { GroupsTileComponent } from './tile/tile.component';
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
import { GroupsProfile } from './profile/profile';
import { GroupsCreator } from './create/create';
import { GroupsMembershipsComponent } from './memberships/memberships.component';
import { GroupsSearchService } from './profile/feed/search.service';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { PathMatch } from '../../common/types/angular.types';
import { FindGroupsButtonsComponent } from '../../common/standalone/groups/find-groups-buttons/find-groups-buttons.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { NoticesModule } from '../notices/notices.module';

const routes: Routes = [
  {
    path: 'groups/profile/:guid',
    component: GroupsProfile,
    canDeactivate: [CanDeactivateGroupService],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' as PathMatch },
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
  {
    path: 'groups',
    redirectTo: '/groups/memberships',
    pathMatch: 'full' as PathMatch,
  },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    ModalsModule,
    HashtagsModule,
    TextInputAutocompleteModule,
    VideoChatModule,
    NewsfeedModule,
    ComposerModule,
    ActivityModule,
    SuggestionsModule,
    NoticesModule,
    FindGroupsButtonsComponent, // standalone
  ],
  declarations: [
    GroupsProfile,
    GroupsCreator,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupProfileFeedComponent,
    GroupProfileFeedSortedComponent,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsTileComponent,
    GroupMemberPreviews,
    GroupsProfileReviewComponent,
    GroupsKickModalComponent,
    GroupsMembershipsComponent,
  ],
  exports: [
    GroupsProfile,
    GroupsCreator,
    GroupsProfileMembersInvite,
    GroupsCard,
    GroupsCardUserActionsButton,
    GroupsProfileMembers,
    GroupsProfileRequests,
    GroupsSettingsButton,
    GroupsProfileReviewComponent,
    GroupProfileFeedComponent,
    GroupMemberPreviews,
  ],
  providers: [CanDeactivateGroupService, GroupsSearchService],
})
export class GroupsModule {}
