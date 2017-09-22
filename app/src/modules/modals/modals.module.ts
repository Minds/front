import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '../../common/common.module';
import { MindsFormsModule } from '../forms/forms.module';

import { ConfirmModal } from './confirm/confirm';
import { InviteModal } from './invite/invite';
import { RemindComposerModal } from './remind-composer/remind-composer';
import { ShareModal } from './share/share';
import { SignupOnActionModal } from './signup/signup-on-action';
import { SignupOnScrollModal } from './signup/signup-on-scroll';
import { SignupModal } from './signup/signup';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    ReactiveFormsModule,
    MindsFormsModule
  ],
  declarations: [
    ConfirmModal,
    InviteModal,
    RemindComposerModal,
    ShareModal,
    SignupOnActionModal,
    SignupOnScrollModal,
    SignupModal,
  ],
  exports: [
    ConfirmModal,
    InviteModal,
    RemindComposerModal,
    ShareModal,
    SignupOnActionModal,
    SignupOnScrollModal,
    SignupModal,
  ]
})
export class ModalsModule {
}
