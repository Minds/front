import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { MindsFormsModule } from '../../forms/forms.module';
import { ResetPasswordModalComponent } from './reset-password-modal.component';
import { ResetPasswordModalRequestFormComponent } from './forms/request/request.component';
import { ResetPasswordModalResetFormComponent } from './forms/reset/reset.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    MindsFormsModule,
    FormsModule,
    ReactiveFormsModule,
    ModalCloseButtonComponent,
  ],
  declarations: [
    ResetPasswordModalComponent,
    ResetPasswordModalRequestFormComponent,
    ResetPasswordModalResetFormComponent,
  ],
  exports: [ResetPasswordModalComponent],
})
export class ResetPasswordModalModule {
  public resolveComponent(): typeof ResetPasswordModalComponent {
    return ResetPasswordModalComponent;
  }
}
