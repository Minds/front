import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { MindsFormsModule } from '../forms/forms.module';

import { ConfirmModal } from './confirm/confirm';
import { RemindComposerModal } from './remind-composer/remind-composer';
import { ShareModalComponent } from './share/share';
import { SignupOnActionModal } from './signup/signup-on-action';
import { SignupOnScrollModal } from './signup/signup-on-scroll';
import { ConfirmPasswordModalComponent } from './confirm-password/modal.component';
import { SignupModal } from './signup/signup';
import { TOSUpdatedModal } from './tos-updated/tos.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    MindsFormsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [
    ConfirmModal,
    RemindComposerModal,
    ShareModalComponent,
    SignupOnActionModal,
    SignupOnScrollModal,
    SignupModal,
    ConfirmPasswordModalComponent,
    TOSUpdatedModal,
  ],
  entryComponents: [ConfirmPasswordModalComponent],
  exports: [
    ConfirmModal,
    RemindComposerModal,
    ShareModalComponent,
    SignupOnActionModal,
    SignupOnScrollModal,
    SignupModal,
    TOSUpdatedModal,
  ],
})
export class ModalsModule {}
