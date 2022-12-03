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
import { ActivityMenuComponent } from './menu/menu.component';
import { PostMenuModule } from '../../../common/components/post-menu/post-menu.module';
import { WireModule } from '../../wire/wire.module';
import { ActivityNsfwConsentComponent } from './nsfw-consent/nsfw-consent.component';
import { ActivityMetricsComponent } from './metrics/metrics.component';
import { ActivityRemindComponent } from './remind/remind.component';
import { ActivityPaywallComponent } from './paywall/paywall.component';
import { CodeHighlightModule } from '../../code-highlight/code-highlight.module';
import { ActivityModalComponent } from './modal/modal.component';
import { ActivityModalTitleOverlayComponent } from './modal/title-overlay/title-overlay.component';
import { ActivityModalPagerComponent } from './modal/pager/pager.component';
import { ActivityModalCreatorService } from './modal/modal-creator.service';
import { ActivityMinimalMetricsComponent } from './minimal-metrics/minimal-metrics.component';
import { ActivityRemindButtonComponent } from './remind-button/remind-button.component';
import { ActivityModalQuoteComponent } from './modal/quote/quote.component';
import { ActivityBoostButtonComponent } from './boost-button/boost-button.component';
import { ActivityV2Module } from '../activity-v2/activity.module';

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
    PostMenuModule,
    WireModule,
    CodeHighlightModule,
    ActivityV2Module,
  ],
  declarations: [
    ActivityComponent, // ojm remove?
    ActivityOwnerBlockComponent,
    ActivityContentComponent,
    ActivityToolbarComponent,
    ActivityMenuComponent,
    ActivityNsfwConsentComponent,
    ActivityMetricsComponent,
    ActivityRemindComponent,
    ActivityPaywallComponent,
    ActivityModalComponent,
    ActivityModalTitleOverlayComponent,
    ActivityModalPagerComponent,
    ActivityMinimalMetricsComponent,
    ActivityRemindButtonComponent,
    ActivityBoostButtonComponent,
    ActivityModalQuoteComponent,
  ],
  providers: [ActivityModalCreatorService],
  exports: [ActivityComponent, ActivityRemindButtonComponent],
})
export class ActivityModule {}
