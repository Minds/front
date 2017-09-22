import { NgModule } from '@angular/core';
import { ReCaptchaComponent } from './recaptcha/recaptcha.component';
import { RECAPTCHA_SERVICE_PROVIDER } from './recaptcha/recaptcha.service';

@NgModule({
  declarations: [
    ReCaptchaComponent
  ],
  exports: [
    ReCaptchaComponent
  ],
  providers: [
    RECAPTCHA_SERVICE_PROVIDER
  ]
})

export class CaptchaModule {}
