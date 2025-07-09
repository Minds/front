import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CaptchaComponent } from './captcha.component';
import { FormsModule } from '@angular/forms';
import { CaptchaModalComponent } from './captcha-modal/captcha-modal.component';
import { CommonModule } from '../../common/common.module';
import { ModalCloseButtonComponent } from '~/common/components/modal-close-button/modal-close-button.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    ModalCloseButtonComponent,
  ],
  declarations: [CaptchaComponent, CaptchaModalComponent],
  exports: [CaptchaComponent],
})
export class CaptchaModule {}
