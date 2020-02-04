import { NgModule } from '@angular/core';
import { CaptchaComponent } from './captcha.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [CaptchaComponent],
  exports: [CaptchaComponent],
})
export class CaptchaModule {}
