import { SuggestionsModule } from '../../suggestions/suggestions.module';
import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '../../../common/common.module';
import { MessengerModule } from '../../messenger/messenger.module';
import { NewsfeedModule } from '../../newsfeed/newsfeed.module';
import { GroupComponent } from './group.component';
import { GroupHeaderComponent } from './header/header.component';
import { GroupActionsComponent } from './actions/actions.component';
import { HashtagsModule } from '../../hashtags/hashtags.module';
import { ModalsModule } from '../../modals/modals.module';
import { DiscoverySharedModule } from '../../discovery/discovery-shared.module';
import { ComposerModule } from '../../composer/composer.module';
import { ExperimentsModule } from '../../experiments/experiments.module';
import { GroupsModule } from '../groups.module';
import { GroupFeedComponent } from './feed/feed.component';
import { GroupAboutComponent } from './about/about.component';
import { GroupMemberPreviewsComponent } from './member-previews/member-previews.component';
import { GroupMembersListComponent } from './members/list/list.component';
import { GroupMembersComponent } from './members/members.component';
import { GroupMemberActionsComponent } from './members/member-actions/member-actions.component';
import { GroupSettingsButton } from './settings-button/settings-button.component';
import { GroupEditModalService } from './edit/edit.modal.service';
import { GroupEditService } from './edit/edit.service';
import { GroupEditProfileComponent } from './edit/panes/profile/profile.component';
import { GroupEditComponent } from './edit/edit.component';
import { GroupReviewComponent } from './review/review.component';
import { GroupInviteService } from './invite/invite.service';
import { GroupInviteModalService } from './invite/invite.modal.service';
import { GroupInviteComponent } from './invite/invite.component';
import { GroupInviteButtonComponent } from './invite/invite-button.component';
import { GroupMembersListService } from './members/list/list.service';

const routes: Routes = [
  {
    path: 'group/:guid',
    redirectTo: 'group/:guid/feed',
    pathMatch: 'full',
  },
  {
    path: 'group/:guid/:view',
    component: GroupComponent,
  },
];

/**
 * Generally available components
 */
const COMPONENTS = [GroupComponent];

/**
 * Internal components
 */
const INTERNAL_COMPONENTS = [
  GroupHeaderComponent,
  GroupActionsComponent,
  GroupFeedComponent,
  GroupAboutComponent,
  GroupMemberPreviewsComponent,
  GroupMembersComponent,
  GroupMembersListComponent,
  GroupMemberActionsComponent,
  GroupSettingsButton,
  GroupEditComponent,
  GroupEditProfileComponent,
  GroupReviewComponent,
  GroupInviteComponent,
  GroupInviteButtonComponent,
];

/**
 * Module definition
 */
@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NewsfeedModule,
    MessengerModule,
    HashtagsModule,
    ModalsModule,
    DiscoverySharedModule,
    ComposerModule,
    ExperimentsModule,
    SuggestionsModule,
    GroupsModule,
    ComposerModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  providers: [
    GroupMembersListService,
    GroupEditService,
    GroupEditModalService,
    GroupInviteService,
    GroupInviteModalService,
  ],
  exports: COMPONENTS,
})
export class GroupModule {}
