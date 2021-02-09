import { NgModule } from '@angular/core';
import { CaptchaComponent } from './captcha.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CaptchaModalComponent } from './captcha-modal/captcha-modal.component';
@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CaptchaComponent, CaptchaModalComponent],
  exports: [CaptchaComponent],
})
export class CaptchaModule {}
