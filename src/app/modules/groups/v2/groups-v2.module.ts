import { NgModule } from '@angular/core';
import { GroupProfileComponent } from './profile/profile.component';
import { GroupHeaderComponent } from './profile/header/header.component';
import { GroupContentComponent } from './profile/content/content.component';
import { GroupMembersComponent } from './profile/members/members.component';
import { GroupFeedComponent } from './profile/feed/feed.component';
import { GroupV2Service } from './services/group-v2.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanDeactivateGroupService } from '../profile/can-deactivate/can-deactivate-group.service';
import { GroupsCreator } from '../create/create';
import { GroupsListComponent } from '../list.component';
import { CommonModule } from '../../../common/common.module';
import { GroupsModule } from '../groups.module';
import { TextInputAutocompleteModule } from '../../../common/components/autocomplete';
import { ComposerModule } from '../../composer/composer.module';
import { VideoChatModule } from '../../videochat/videochat.module';
import { GroupChatComponent } from './profile/chat/chat.component';
import { ActivityModule } from '../../newsfeed/activity/activity.module';
import { CommentsModule } from '../../comments/comments.module';
import { GroupInfoComponent } from './profile/info/info.component';
import { LegacyModule } from '../../legacy/legacy.module';
import { GroupMemberButton } from './profile/members/button/button.component';
import { GroupsMemberInviteModalComponent } from './profile/members/modal/modal.component';
import { GroupActionsComponent } from './profile/actions/actions.component';
import { GroupActionJoinComponent } from './profile/actions/join/join.component';
import { GroupActionEditComponent } from './profile/actions/edit/edit.component';
import { GroupEditModalComponent } from './profile/edit/edit.component';
import { GroupEditDescriptionComponent } from './profile/edit/description/description.component';
import { GroupEditHashtagsComponent } from './profile/edit/hashtags/hashtags.component';
import { HashtagsModule } from '../../hashtags/hashtags.module';
import { GroupEditOtherComponent } from './profile/edit/other/other.component';

const routes: Routes = [
  {
    path: 'groups/profile/:guid',
    component: GroupProfileComponent,
    canDeactivate: [CanDeactivateGroupService],
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed/:filter', component: GroupFeedComponent },
      { path: 'feed', component: GroupFeedComponent },
      { path: 'chat', component: GroupChatComponent },
      { path: 'activity', redirectTo: 'feed' },
      { path: 'members', component: GroupMembersComponent },
    ],
  },
  {
    path: 'groups/create',
    component: GroupsCreator,
    data: {
      title: 'Create a group',
    },
  },
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
    CommentsModule,
    GroupsModule,
    TextInputAutocompleteModule,
    VideoChatModule,
    ComposerModule,
    ActivityModule,
    LegacyModule,
    HashtagsModule,
  ],
  exports: [],
  declarations: [
    GroupProfileComponent,
    GroupHeaderComponent,
    GroupContentComponent,
    GroupMembersComponent,
    GroupFeedComponent,
    GroupChatComponent,
    GroupInfoComponent,
    GroupMemberButton,
    GroupsMemberInviteModalComponent,
    GroupActionsComponent,
    GroupActionEditComponent,
    GroupActionJoinComponent,
    GroupEditModalComponent,
    GroupEditDescriptionComponent,
    GroupEditHashtagsComponent,
    GroupEditOtherComponent,
  ],
  providers: [GroupV2Service],
})
export class GroupsV2Module {}
