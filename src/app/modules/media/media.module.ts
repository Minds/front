import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { ModalsModule } from '../modals/modals.module';
import { MindsFormsModule } from '../forms/forms.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { WireModule } from '../wire/wire.module';
import { PostMenuModule } from '../../common/components/post-menu/post-menu.module';
import { VideoModule } from './components/video/video.module';

import { CommentsModule } from '../comments/comments.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
// import { BlogModule } from '../blogs/blog.module';
import { YoutubeMigrationMarketingComponent } from './youtube-migration/marketing/marketing.component';
import { TranslateModule } from '../translate/translate.module';
import { MindsOnlyRedirectGuard } from '../../common/guards/minds-only-redirect.guard';

const routes: Routes = [
  { path: 'media/videos/:filter', redirectTo: 'newsfeed/global/top' },
  {
    path: 'media/videos',
    redirectTo: 'newsfeed/global/top',
  },
  { path: 'media/images/:filter', redirectTo: 'newsfeed/global/top' },
  {
    path: 'media/images',
    redirectTo: 'newsfeed/global/top',
  },

  { path: 'media/:container/:guid', redirectTo: 'newsfeed/:guid' },
  { path: 'media/:guid', redirectTo: 'newsfeed/:guid' },

  {
    path: 'youtube-migration',
    component: YoutubeMigrationMarketingComponent,
    canActivate: [MindsOnlyRedirectGuard],
    data: {
      preventLayoutReset: true,
    },
  },

  /* Legacy routes */
  { path: 'archive/view/:container/:guid', redirectTo: 'newsfeed/:guid' },
  { path: 'archive/view/:guid', redirectTo: 'newsfeed/:guid' },
];

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule.forChild(routes),
    NgFormsModule,
    ReactiveFormsModule,
    CommonModule,
    CommentsModule,
    ModalsModule,
    MindsFormsModule,
    WireModule,
    PostMenuModule,
    VideoModule,
    HashtagsModule,
    //BlogModule,
    TranslateModule,
  ],
})
export class MediaModule {}
