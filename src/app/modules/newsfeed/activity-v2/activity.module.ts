import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../../common/common.module';
import { ActivityV2Component } from './activity.component';
import { ActivityV2OwnerBlockComponent } from './owner-block/owner-block.component';
import { ActivityV2ContentComponent } from './content/content.component';
import { CommentsModule } from '../../comments/comments.module';
import { TranslateModule } from '../../translate/translate.module';
import { VideoModule } from '../../media/components/video/video.module';
import { MediaModule } from '../../media/media.module';
import { ActivityV2ToolbarComponent } from './toolbar/toolbar.component';
import { ModalsModule } from '../../modals/modals.module';
import { LegacyModule } from '../../legacy/legacy.module';
import { ActivityV2MenuComponent } from './menu/menu.component';
import { PostMenuModule } from '../../../common/components/post-menu/post-menu.module';
import { WireModule } from '../../wire/wire.module';
import { ActivityV2NsfwConsentComponent } from './nsfw-consent/nsfw-consent.component';
import { ActivityV2MetricsComponent } from './metrics/metrics.component';
import { ActivityV2RemindComponent } from './remind/remind.component';
import { ActivityV2PaywallComponent } from './paywall/paywall.component';
import { CodeHighlightModule } from '../../code-highlight/code-highlight.module';
import { ActivityV2ModalComponent } from './modal/modal.component';
import { ActivityV2ModalTitleOverlayComponent } from './modal/title-overlay/title-overlay.component';
import { ActivityV2ModalPagerComponent } from './modal/pager/pager.component';
import { ActivityV2ModalCreatorService } from './modal/modal-creator.service';
import { ActivityV2MinimalMetricsComponent } from './minimal-metrics/minimal-metrics.component';
import { ActivityV2RemindButtonComponent } from './remind-button/remind-button.component';
import { ActivityV2ModalQuoteComponent } from './modal/quote/quote.component';
import { ActivityV2RelativeTimeSpanComponent } from './owner-block/relative-time-span/relative-time-span.component';
import { ActivityV2BoostButtonComponent } from './boost-button/boost-button.component';
import { ActivityV2FlagComponent } from './flag/flag.component';
import { ActivityV2BadgesComponent } from './badges/badges.component';

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
    CodeHighlightModule,
  ],
  declarations: [
    ActivityV2Component,
    ActivityV2OwnerBlockComponent,
    ActivityV2ContentComponent,
    ActivityV2ToolbarComponent,
    ActivityV2MenuComponent,
    ActivityV2NsfwConsentComponent,
    ActivityV2MetricsComponent,
    ActivityV2RemindComponent,
    ActivityV2PaywallComponent,
    ActivityV2ModalComponent,
    ActivityV2ModalTitleOverlayComponent,
    ActivityV2ModalPagerComponent,
    ActivityV2MinimalMetricsComponent,
    ActivityV2RemindButtonComponent,
    ActivityV2BoostButtonComponent,
    ActivityV2ModalQuoteComponent,
    ActivityV2RelativeTimeSpanComponent,
    ActivityV2FlagComponent,
    ActivityV2BadgesComponent,
  ],
  providers: [ActivityV2ModalCreatorService],
  exports: [ActivityV2Component, ActivityV2RemindButtonComponent],
})
export class ActivityV2Module {}
