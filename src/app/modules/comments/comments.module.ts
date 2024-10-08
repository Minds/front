import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CommentsScrollDirective } from './scroll';
import { CommonModule } from '../../common/common.module';
import { VideoModule } from '../media/components/video/video.module';
import { TranslateModule } from '../translate/translate.module';
import { ModalsModule } from '../modals/modals.module';
import { CommentComponentV2 } from './comment/comment.component';
import { CommentPosterComponent } from './poster/poster.component';
import { CommentsTreeComponent } from './tree/tree.component';
import { CommentsThreadComponent } from './thread/thread.component';
import { CommentsService } from './comments.service';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { CodeHighlightModule } from '../code-highlight/code-highlight.module';
import { EmojiPickerModule } from '../../common/components/emoji-picker/emoji-picker.module';
import { CommentsEntityOutletV2Component } from './entity-outlet-v2/entity-outlet.component';
import { SupermindSharedModule } from '../supermind/supermind-shared.module';
import { ReadMoreModule } from '../../common/read-more/v2/read-more.module';

@NgModule({
  imports: [
    NgCommonModule,
    FormsModule,
    RouterModule,
    CommonModule,
    VideoModule,
    TranslateModule,
    ModalsModule,
    TextInputAutocompleteModule,
    CodeHighlightModule,
    EmojiPickerModule,
    SupermindSharedModule,
    ReadMoreModule,
  ],
  declarations: [
    CommentsScrollDirective,
    CommentComponentV2,
    CommentPosterComponent,
    CommentsTreeComponent,
    CommentsThreadComponent,
    CommentsEntityOutletV2Component,
  ],
  exports: [
    CommentsScrollDirective,
    CommentComponentV2,
    CommentPosterComponent,
    CommentsTreeComponent,
    CommentsThreadComponent,
    CommentsEntityOutletV2Component,
  ],
  providers: [CommentsService],
})
export class CommentsModule {}
