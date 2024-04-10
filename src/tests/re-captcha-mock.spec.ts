import { Component, EventEmitter, Input, Output } from '@angular/core';
/**
 * Created by Marcelo on 29/06/2017.
 */
@Component({
  selector: 're-captcha',
  template: '',
})
export class ReCaptchaComponentMock {
  @Output('captchaResponse') response: EventEmitter<any> =
    new EventEmitter<any>();

  @Input('site_key') set siteKey(key: string) {
    this.response.emit('key');
  }
}
