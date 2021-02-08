import { NgModule } from '@angular/core';
import { CaptchaComponent } from './captcha.component';
import { FormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CaptchaModalComponent } from './captcha-modal/captcha-modal.component';
import { CommonModule } from '../../common/common.module';
@NgModule({
  imports: [CommonModule, FormsModule, NgCommonModule],
  declarations: [CaptchaComponent, CaptchaModalComponent],
  exports: [CaptchaComponent],
})
export class CaptchaModule {}
