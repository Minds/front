import { SuggestionsModule } from '../../suggestions/suggestions.module';
import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
];

/**
 * Module definition
 */
@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    FormsModule,
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
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
})
export class GroupModule {}
