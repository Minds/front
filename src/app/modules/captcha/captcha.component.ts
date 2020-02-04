import {
  Component,
  ElementRef,
  forwardRef,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Client } from '../../services/api';

export const CAPTCHA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CaptchaComponent),
  multi: true,
};

export class Captcha {
  jwtToken: string;
  base64Image: string;
  clientText: string; // This is what the user enters

  buildClientKey(): string {
    return JSON.stringify({
      jwtToken: this.jwtToken,
      clientText: this.clientText,
    });
  }
}

@Component({
  selector: 'm-captcha',
  templateUrl: 'captcha.component.html',
  providers: [CAPTCHA_VALUE_ACCESSOR],
})
export class CaptchaComponent implements ControlValueAccessor, OnInit {
  captcha = new Captcha();
  image: string;
  value: string = '';

  propagateChange = (_: any) => {};

  constructor(private client: Client) {}

  ngOnInit(): void {
    this.refresh();
  }

  async refresh(): Promise<void> {
    const response: any = await this.client.get('api/v2/captcha', {
      cb: Date.now(),
    });

    this.captcha.base64Image = response.base64_image;
    this.captcha.jwtToken = response.jwt_token;
  }

  onValueChange(value: string) {
    this.captcha.clientText = value;
    this.value = this.captcha.buildClientKey();
    this.propagateChange(this.value);
  }

  writeValue(value: any): void {
    // Not required as captcha is one direction
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}
}
