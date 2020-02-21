import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { LegacyModule } from '../legacy/legacy.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { AdsModule } from '../ads/ads.module';
import { SuggestionsModule } from '../suggestions/suggestions.module';
import { NoticesModule } from '../notices/notices.module';
import { ReferralsModule } from '../wallet/tokens/referrals/referrals.module';

import { NewsfeedComponent } from './newsfeed.component';
import { NewsfeedSingleComponent } from './single/single.component';
import { NewsfeedBoostRotatorComponent } from './boost-rotator/boost-rotator.component';
import { NewsfeedTopComponent } from './feeds/top.component';
import { NewsfeedSubscribedComponent } from './feeds/subscribed.component';
import { NewsfeedBoostComponent } from './feeds/boost.component';
import { NewsfeedService } from './services/newsfeed.service';
import { NewsfeedBoostService } from './newsfeed-boost.service';
import { NewsfeedDropdownComponent } from './dropdown/dropdown.component';
import { PosterModule } from './poster/poster.module';
import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { NewsfeedTagsComponent } from './feeds/tags/tags.component';
import { NewsfeedSortedComponent } from './feeds/sorted.component';
import { NewsfeedEntityComponent } from './feeds/entity.component';
import { NewsfeedHashtagSelectorService } from './services/newsfeed-hashtag-selector.service';
import { SearchModule } from '../search/search.module';
import { NewsfeedTilesComponent } from './feeds/tiles.component';
import { ActivityModule } from './activity/activity.module';
import { FeedGridComponent } from './feed-grid/feed-grid.component';

const routes: Routes = [
  {
    path: 'newsfeed',
    component: NewsfeedComponent,
    children: [
      { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
      { path: 'suggested', component: NewsfeedTopComponent },
      { path: 'top', redirectTo: 'global/top', pathMatch: 'full' },
      { path: 'global', redirectTo: 'global/top', pathMatch: 'full' },
      { path: 'global/:algorithm', component: NewsfeedSortedComponent },
      { path: 'subscribed', redirectTo: 'subscriptions', pathMatch: 'full' },
      {
        path: 'subscriptions',
        component: NewsfeedSubscribedComponent,
        canDeactivate: [CanDeactivateGuardService],
        data: {
          title: 'Newsfeed',
          description: 'Posts from channels your subscribe to',
        },
      },
      {
        path: 'boost',
        component: NewsfeedBoostComponent,
        canDeactivate: [CanDeactivateGuardService],
        data: {
          title: 'Boost Feed',
          description: 'Posts that have been boosted on the network',
        },
      },
      { path: 'tag/:tag', component: NewsfeedTagsComponent },
    ],
  },
  { path: 'newsfeed/:guid', component: NewsfeedSingleComponent },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    LegacyModule,
    ModalsModule,
    MindsFormsModule,
    AdsModule,
    PosterModule,
    HashtagsModule,
    SuggestionsModule,
    NoticesModule,
    SearchModule,
    ReferralsModule,
    ActivityModule,
  ],
  declarations: [
    NewsfeedDropdownComponent,
    NewsfeedComponent,
    NewsfeedSingleComponent,
    NewsfeedBoostRotatorComponent,
    NewsfeedTopComponent,
    NewsfeedSubscribedComponent,
    NewsfeedBoostComponent,
    NewsfeedTagsComponent,
    NewsfeedSortedComponent,
    NewsfeedEntityComponent,
    NewsfeedTilesComponent,
    FeedGridComponent,
  ],
  providers: [
    NewsfeedService,
    NewsfeedBoostService,
    NewsfeedHashtagSelectorService,
  ],
  exports: [
    NewsfeedDropdownComponent,
    NewsfeedBoostRotatorComponent,
    NewsfeedEntityComponent,
    NewsfeedTilesComponent,
    NewsfeedComponent,
    FeedGridComponent,
  ],
  entryComponents: [NewsfeedComponent, NewsfeedSingleComponent],
})
export class NewsfeedModule {}
