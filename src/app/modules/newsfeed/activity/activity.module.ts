import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../../common/common.module';
import { ActivityComponent } from './activity.component';
import { ActivityOwnerBlockComponent } from './owner-block/owner-block.component';
import { ActivityContentComponent } from './content/content.component';
import { CommentsModule } from '../../comments/comments.module';
import { TranslateModule } from '../../translate/translate.module';
import { VideoModule } from '../../media/components/video/video.module';
import { MediaModule } from '../../media/media.module';
import { ActivityToolbarComponent } from './toolbar/toolbar.component';
import { ModalsModule } from '../../modals/modals.module';
import { LegacyModule } from '../../legacy/legacy.module';
import { ActivityMenuComponent } from './menu/menu.component';
import { PostMenuModule } from '../../../common/components/post-menu/post-menu.module';
import { WireModule } from '../../wire/wire.module';
import { ActivityNsfwConsentComponent } from './nsfw-consent/nsfw-consent.component';
import { ActivityMetricsComponent } from './metrics/metrics.component';
import { ActivityRemindComponent } from './remind/remind.component';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    CommentsModule,
    TranslateModule,
    MediaModule,
    VideoModule,
    ModalsModule,
    LegacyModule, // For remind button
    PostMenuModule,
    WireModule,
  ],
  declarations: [
    ActivityComponent,
    ActivityOwnerBlockComponent,
    ActivityContentComponent,
    ActivityToolbarComponent,
    ActivityMenuComponent,
    ActivityNsfwConsentComponent,
    ActivityMetricsComponent,
    ActivityRemindComponent,
  ],
  providers: [],
  exports: [ActivityComponent],
})
export class ActivityModule {}
