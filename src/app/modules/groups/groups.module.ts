import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { VideoChatModule } from '../videochat/videochat.module';

import { GroupsCard } from './card/card';
import { GroupsProfileRequests } from './profile/requests/requests';
import { GroupsTileComponent } from './tile/tile.component';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { GroupProfileFeedComponent } from './profile/feed/feed.component';
import { GroupProfileFeedSortedComponent } from './profile/feed/sorted.component';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';
import { GroupsProfileReviewComponent } from './profile/review/review.component';
import { GroupsKickModalComponent } from './kick-modal/kick-modal.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { ComposerModule } from '../composer/composer.module';
import { GroupsCreator } from './create/create';
import { GroupsMembershipsComponent } from './memberships/memberships.component';
import { GroupsSearchService } from './profile/feed/search.service';
import { ActivityModule } from '../newsfeed/activity/activity.module';
import { PathMatch } from '../../common/types/angular.types';
import { FindGroupsButtonsComponent } from '../../common/standalone/groups/find-groups-buttons/find-groups-buttons.component';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { NoticesModule } from '../notices/notices.module';
import { GroupsMembershipsListComponent } from './memberships/list/list.component';

const routes: Routes = [
  {
    path: 'groups/profile/:guid',
    redirectTo: 'group/:guid',
  },
  {
    path: 'groups/profile/:guid/feed',
    redirectTo: 'group/:guid/feed',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'groups/profile/:guid/activity',
    redirectTo: 'group/:guid/feed',
    pathMatch: 'full' as PathMatch,
  },
  {
    path: 'groups/profile/:guid/feed/review',
    redirectTo: 'group/:guid/review',
  },
  {
    path: 'groups/profile/:guid/members',
    redirectTo: 'group/:guid/members',
  },
  {
    path: 'groups/profile/:guid/requests',
    redirectTo: 'group/:guid/review',
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
    GroupsCreator,
    GroupsCard,
    GroupProfileFeedComponent,
    GroupProfileFeedSortedComponent,
    GroupsProfileRequests,
    GroupsTileComponent,
    GroupsProfileReviewComponent,
    GroupsKickModalComponent,
    GroupsMembershipsComponent,
    GroupsMembershipsListComponent,
  ],
  exports: [
    GroupsCreator,
    GroupsCard,
    GroupsProfileRequests,
    GroupsProfileReviewComponent,
    GroupProfileFeedComponent,
  ],
  providers: [GroupsSearchService],
})
export class GroupsModule {}
