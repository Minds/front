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
import { ActivityV2QuoteComponent } from './quote/quote.component';
import { ActivityV2PaywallComponent } from './paywall/paywall.component';
import { CodeHighlightModule } from '../../code-highlight/code-highlight.module';
import { ActivityV2ModalComponent } from './modal/modal.component';
import { ActivityV2ModalTitleOverlayComponent } from './modal/title-overlay/title-overlay.component';
import { ActivityV2ModalPagerComponent } from './modal/pager/pager.component';
import { ActivityV2ModalCreatorService } from './modal/modal-creator.service';
import { ActivityV2RemindButtonComponent } from './remind-button/remind-button.component';
import { ActivityV2RelativeTimeSpanComponent } from './owner-block/relative-time-span/relative-time-span.component';
import { ActivityV2BoostButtonComponent } from './boost-button/boost-button.component';
import { ActivityV2FlagComponent } from './flag/flag.component';
import { ActivityV2BadgesComponent } from './badges/badges.component';
import { ActivityV2PermalinkComponent } from './permalink/permalink.component';
import { ActivityV2ViewsComponent } from './views/views.component';
import { ReadMoreModule } from '../../../common/read-more/v2/read-more.module';
import { ActivityV2BoostedFlagComponent } from './flag/boosted-flag/boosted-flag.component';

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
    ReadMoreModule,
  ],
  declarations: [
    ActivityV2Component,
    ActivityV2OwnerBlockComponent,
    ActivityV2ContentComponent,
    ActivityV2ToolbarComponent,
    ActivityV2MenuComponent,
    ActivityV2NsfwConsentComponent,
    ActivityV2QuoteComponent,
    ActivityV2PaywallComponent,
    ActivityV2ModalComponent,
    ActivityV2ModalTitleOverlayComponent,
    ActivityV2ModalPagerComponent,
    ActivityV2RemindButtonComponent,
    ActivityV2BoostButtonComponent,
    ActivityV2RelativeTimeSpanComponent,
    ActivityV2FlagComponent,
    ActivityV2BoostedFlagComponent,
    ActivityV2BadgesComponent,
    ActivityV2PermalinkComponent,
    ActivityV2ViewsComponent,
  ],
  providers: [ActivityV2ModalCreatorService],
  exports: [
    ActivityV2Component,
    ActivityV2RemindButtonComponent,
    ActivityV2BoostedFlagComponent,
  ],
})
export class ActivityV2Module {}
