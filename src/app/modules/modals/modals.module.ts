import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '../../common/common.module';
import { MindsFormsModule } from '../forms/forms.module';

import { ConfirmModal } from './confirm/confirm';
import { ShareModalComponent } from './share/share';
import { ConfirmPasswordModalComponent } from './confirm-password/modal.component';
import { TOSUpdatedModal } from './tos-updated/tos.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { PhotoBannerModalComponent } from './photo-banner/photo-banner-modal.component';
import { SupermindReplyConfirmModalComponent } from './supermind-reply-confirm/supermind-reply-confirm-modal.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    MarkdownModule.forRoot(),
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    MindsFormsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [
    ConfirmModal,
    PhotoBannerModalComponent,
    ShareModalComponent,
    ConfirmPasswordModalComponent,
    TOSUpdatedModal,
    SupermindReplyConfirmModalComponent,
  ],
  exports: [
    ConfirmModal,
    ShareModalComponent,
    TOSUpdatedModal,
    PhotoBannerModalComponent,
  ],
})
export class ModalsModule {}
