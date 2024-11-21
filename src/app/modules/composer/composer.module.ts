import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

import { CommonModule } from '../../common/common.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { ComposerModalService } from './components/modal/modal.service';
import { RichEmbedService } from './services/rich-embed.service';
import { AttachmentService } from './services/attachment.service';
import { ComposerComponent } from './composer.component';
import { ModalComponent } from './components/modal/modal.component';
import { BaseComponent } from './components/base/base.component';
import { AttachmentPreviewComponent } from './components/preview/attachment-preview.component';
import { RichEmbedPreviewComponent } from './components/preview/rich-embed-preview.component';
import { PreviewService } from './services/preview.service';
import { PreviewWrapperComponent } from './components/preview/preview-wrapper.component';
import { ProgressComponent } from './components/progress/progress.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { PopupComponent } from './components/popup/popup.component';
import { NsfwComponent } from './components/popup/nsfw/nsfw.component';
import { TagsComponent } from './components/popup/tags/tags.component';
import { ScheduleComponent } from './components/popup/schedule/schedule.component';
import { PermawebTermsComponent } from './components/popup/permaweb/permaweb-terms.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { ComposerMonetizeV2PlusComponent } from './components/popup/monetize/v2/components/plus/plus.component';
import { ComposerMonetizeV2MembershipsComponent } from './components/popup/monetize/v2/components/memberships/memberships.component';
import { ComposerMonetizeV2Component } from './components/popup/monetize/v2/components/monetize.component';

import { TextInputAutocompleteModule } from '../../common/components/autocomplete/text-input-autocomplete.module';
import { RouterModule } from '@angular/router';
import { ComposerTitleBarDropdownComponent } from './components/title-bar/dropdown/dropdown.component';
import { QuotePreviewComponent } from './components/preview/quote-preview.component';
import { AttachmentErrorComponent } from './components/popup/attachment-error/attachment-error.component';
import { EmojiPickerModule } from '../../common/components/emoji-picker/emoji-picker.module';
import { UploaderService } from './services/uploader.service';
import { ComposerSupermindComponent } from './components/popup/supermind/supermind.component';
import { PaymentsModule } from '../payments/payments.module';
import { ComposerAudienceSelectorButtonComponent } from './components/audience-selector-button/audience-selector-button.component';
import { ComposerAudienceSelectorService } from './services/audience.service';
import { ComposerAudienceSelectorPanelComponent } from './components/popup/audience-selector/audience-selector.component';
import { LiveStreamComponent } from './components/livestream/livestream.component';
import { ComposerSiteMembershipSelectorComponent } from './components/popup/site-membership-selector/site-membership-selector.component';
import { ComposerSiteMembershipPostPreview } from './components/site-membership-post-preview/site-membership-post-preview.component';
import { ComposerBoostToggleComponent } from './components/boost-button/boost-toggle.component';
import { AttachmentPreviewAudioComponent } from './components/preview/audio/attachment-preview-audio.component';

/**
 * Exported components
 */
const COMPONENTS = [
  ComposerComponent,
  ModalComponent,
  NsfwComponent,
  TagsComponent,
  ScheduleComponent,
  PermawebTermsComponent,
  AttachmentErrorComponent,
  ComposerMonetizeV2Component,
  ComposerMonetizeV2PlusComponent,
  ComposerMonetizeV2MembershipsComponent,
  ComposerTitleBarDropdownComponent,
  ComposerAudienceSelectorButtonComponent,
];

/**
 * Components used internally
 */
const INTERNAL_COMPONENTS = [
  BaseComponent,
  AttachmentPreviewComponent,
  AttachmentPreviewAudioComponent,
  RichEmbedPreviewComponent,
  QuotePreviewComponent,
  PreviewWrapperComponent,
  ProgressComponent,
  ToolbarComponent,
  TitleBarComponent,
  LiveStreamComponent,
  PopupComponent,
  TextAreaComponent,
  ComposerSupermindComponent,
  ComposerAudienceSelectorPanelComponent,
  ComposerSiteMembershipSelectorComponent,
  ComposerSiteMembershipPostPreview,
  ComposerBoostToggleComponent,
];

const PROVIDERS = [
  ComposerModalService,
  AttachmentService,
  RichEmbedService,
  PreviewService,
  UploaderService,
  ComposerAudienceSelectorService,
];

/**
 * Module definition
 */
@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HashtagsModule,
    TextInputAutocompleteModule,
    RouterModule,
    EmojiPickerModule,
    MatGridListModule,
    PaymentsModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  providers: PROVIDERS,
})
export class ComposerModule {}
