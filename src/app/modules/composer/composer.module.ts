import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
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
import { PreviewComponent } from './components/preview/preview.component';
import { ProgressComponent } from './components/progress/progress.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { PopupComponent } from './components/popup/popup.component';
import { NsfwComponent } from './components/popup/nsfw/nsfw.component';
import { MonetizeComponent } from './components/popup/monetize/monetize.component';
import { TagsComponent } from './components/popup/tags/tags.component';
import { ScheduleComponent } from './components/popup/schedule/schedule.component';
import { PermawebTermsComponent } from './components/popup/permaweb/permaweb-terms.component';
import { TextAreaComponent } from './components/text-area/text-area.component';
import { ComposerTopbarButtonComponent } from './topbar-button/topbar-button.component';
import { ComposerCoverPhotoSelectorComponent } from './components/cover-photo-selector/cover-photo-selector.component';
import { ComposerMonetizeV2PlusComponent } from './components/popup/monetize/v2/components/plus/plus.component';
import { ComposerMonetizeV2MembershipsComponent } from './components/popup/monetize/v2/components/memberships/memberships.component';
import { ComposerMonetizeV2CustomComponent } from './components/popup/monetize/v2/components/custom/custom.component';
import { ComposerMonetizeV2Component } from './components/popup/monetize/v2/components/monetize.component';

import { TextInputAutocompleteModule } from '../../common/components/autocomplete/text-input-autocomplete.module';
import { RouterModule } from '@angular/router';
import { ComposerTitleBarDropdownComponent } from './components/title-bar/dropdown/dropdown.component';
import { RemindPreviewComponent } from './components/preview/remind-preview.component';
import { AttachmentErrorComponent } from './components/popup/attachment-error/attachment-error.component';
/**
 * Exported components
 */
const COMPONENTS = [
  ComposerComponent,
  ModalComponent,
  NsfwComponent,
  MonetizeComponent,
  TagsComponent,
  ScheduleComponent,
  PermawebTermsComponent,
  AttachmentErrorComponent,
  ComposerTopbarButtonComponent,
  ComposerMonetizeV2Component,
  ComposerMonetizeV2PlusComponent,
  ComposerMonetizeV2MembershipsComponent,
  ComposerMonetizeV2CustomComponent,
  ComposerTitleBarDropdownComponent,
];

/**
 * Components used internally
 */
const INTERNAL_COMPONENTS = [
  BaseComponent,
  AttachmentPreviewComponent,
  RichEmbedPreviewComponent,
  RemindPreviewComponent,
  PreviewComponent,
  ProgressComponent,
  ToolbarComponent,
  TitleBarComponent,
  PopupComponent,
  TextAreaComponent,
  ComposerCoverPhotoSelectorComponent,
];

const PROVIDERS = [
  ComposerModalService,
  AttachmentService,
  RichEmbedService,
  PreviewService,
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
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  providers: PROVIDERS,
})
export class ComposerModule {}
