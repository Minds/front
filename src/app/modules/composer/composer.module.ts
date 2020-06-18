import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { HashtagsModule } from '../hashtags/hashtags.module';
import { ModalService } from './components/modal/modal.service';
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
import { TextAreaComponent } from './components/text-area/text-area.component';
import { ComposerTopbarButtonComponent } from './topbar-button/topbar-button.component';
import { ComposerCoverPhotoSelectorComponent } from './components/cover-photo-selector/cover-photo-selector.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete/text-input-autocomplete.module';
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
  ComposerTopbarButtonComponent,
];

/**
 * Components used internally
 */
const INTERNAL_COMPONENTS = [
  BaseComponent,
  AttachmentPreviewComponent,
  RichEmbedPreviewComponent,
  PreviewComponent,
  ProgressComponent,
  ToolbarComponent,
  TitleBarComponent,
  PopupComponent,
  TextAreaComponent,
  ComposerCoverPhotoSelectorComponent,
];

const PROVIDERS = [
  ModalService,
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
    CommonModule,
    HashtagsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [...INTERNAL_COMPONENTS, ...COMPONENTS],
  exports: COMPONENTS,
  providers: PROVIDERS,
})
export class ComposerModule {}
