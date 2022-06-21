import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { CommonModule } from '../../common/common.module';
import { MindsFormsModule } from '../forms/forms.module';

import { ConfirmModal } from './confirm/confirm';
import { ShareModalComponent } from './share/share';
import { SignupOnActionModal } from './signup/signup-on-action';
import { ConfirmPasswordModalComponent } from './confirm-password/modal.component';
import { SignupModal } from './signup/signup';
import { TOSUpdatedModal } from './tos-updated/tos.component';
import { TextInputAutocompleteModule } from '../../common/components/autocomplete';
import { ConcertColorsModalComponent } from './concert-colors/concert-colors-modal.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([]),
    FormsModule,
    NgbModalModule,
    ReactiveFormsModule,
    MindsFormsModule,
    TextInputAutocompleteModule,
  ],
  declarations: [
    ConfirmModal,
    ConcertColorsModalComponent,
    ShareModalComponent,
    SignupOnActionModal,
    SignupModal,
    ConfirmPasswordModalComponent,
    TOSUpdatedModal,
  ],
  exports: [
    ConfirmModal,
    ShareModalComponent,
    SignupOnActionModal,
    SignupModal,
    TOSUpdatedModal,
    ConcertColorsModalComponent,
  ],
})
export class ModalsModule {}
