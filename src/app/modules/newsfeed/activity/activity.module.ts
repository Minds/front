import { NgModule } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import {
  FormsModule as NgFormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';

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
import { ActivityQuoteComponent } from './quote/quote.component';
import { ActivityPaywallComponent } from './paywall/paywall.component';
import { CodeHighlightModule } from '../../code-highlight/code-highlight.module';
import { ActivityModalComponent } from './modal/modal.component';
import { ActivityModalTitleOverlayComponent } from './modal/title-overlay/title-overlay.component';
import { ActivityModalPagerComponent } from './modal/pager/pager.component';
import { ActivityModalCreatorService } from './modal/modal-creator.service';
import { ActivityRemindButtonComponent } from './remind-button/remind-button.component';
import { ActivityRelativeTimeSpanComponent } from './owner-block/relative-time-span/relative-time-span.component';
import { ActivityBoostButtonComponent } from './boost-button/boost-button.component';
import { ActivityFlagComponent } from './flag/flag.component';
import { ActivityBadgesComponent } from './badges/badges.component';
import { ActivityPermalinkComponent } from './permalink/permalink.component';
import { ActivityViewsComponent } from './views/views.component';
import { ReadMoreModule } from '../../../common/read-more/v2/read-more.module';
import { ActivityMultiImageComponent } from './content/images/multi-image.component';
import { SupermindSharedModule } from '../../supermind/supermind-shared.module';
import { ActivitySupermindReplyLinkComponent } from './supermind-reply-link/supermind-reply-link.component';
import { ComposerModule } from '../../composer/composer.module';
import { ActivityFlagMutualSubscriptionsComponent } from './flag/mutual-subscriptions/mutual-subscriptions.component';
import { ActivityBoostCtaComponent } from './boost-cta/boost-cta.component';
import { ActivityAvatarComponent } from './avatar/avatar.component';
import { ActivityDownvoteNoticeComponent } from './downvote-notice/downvote-notice.component';
import { SiteMembershipBadgeComponent } from '../../../common/components/site-membership-badge/site-membership-badge.component';
import { ActivitySiteMembershipCtaComponent } from './site-membership-cta/site-membership-cta.component';
import { AudioPlayerComponent } from '../../media/components/audio/components/audio-player/audio-player.component';

@NgModule({
  imports: [
    NgCommonModule,
    NgFormsModule,
    NgOptimizedImage,
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
    ReadMoreModule,
    MatGridListModule,
    SupermindSharedModule,
    ComposerModule,
    SiteMembershipBadgeComponent,
    AudioPlayerComponent,
  ],
  declarations: [
    ActivityComponent,
    ActivityOwnerBlockComponent,
    ActivityContentComponent,
    ActivityToolbarComponent,
    ActivityMenuComponent,
    ActivityNsfwConsentComponent,
    ActivityQuoteComponent,
    ActivityPaywallComponent,
    ActivityModalComponent,
    ActivityModalTitleOverlayComponent,
    ActivityModalPagerComponent,
    ActivityRemindButtonComponent,
    ActivityBoostButtonComponent,
    ActivityRelativeTimeSpanComponent,
    ActivityFlagComponent,
    ActivityBadgesComponent,
    ActivityPermalinkComponent,
    ActivityViewsComponent,
    ActivityMultiImageComponent,
    ActivitySupermindReplyLinkComponent,
    ActivityFlagMutualSubscriptionsComponent,
    ActivityBoostCtaComponent,
    ActivityAvatarComponent,
    ActivityDownvoteNoticeComponent,
    ActivitySiteMembershipCtaComponent,
  ],
  providers: [ActivityModalCreatorService],
  exports: [ActivityComponent, ActivityRemindButtonComponent],
})
export class ActivityModule {}
