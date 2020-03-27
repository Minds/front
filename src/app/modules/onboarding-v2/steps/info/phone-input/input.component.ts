import { Component, Input, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { PhoneInputV2Component } from '../../../../../common/components/phone-input-v2/phone-input-v2.component';

@Component({
  selector: 'm-onboarding__phoneverification',
  templateUrl: 'input.component.html',
})
export class PhoneVerificationComponent {
  @Input() tooltipAnchor: 'top' | 'left' = 'left';

  number: string;
  code: number;
  secret: string;

  @Input() error: string;

  numberError: string;
  codeError: string;

  inProgress: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;

  @ViewChild('input', { static: false }) input: PhoneInputV2Component;

  constructor(private client: Client, private session: Session) {}

  async savePhoneNumber() {
    this.verify();
  }

  async verify() {
    this.inProgress = true;
    this.numberError = null;
    this.error = null;
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/verify',
        {
          number: this.number,
        }
      );
      this.secret = response.secret;
      this.confirming = true;
    } catch (e) {
      this.numberError = e.message;
      this.confirming = false;
    }
    this.inProgress = false;
  }

  numberChange(number: string) {
    this.number = number;
    this.error = null;
  }

  codeChange(code: number) {
    this.code = code;
    this.error = null;

    if (code.toString().length === 6) {
      this.confirm();
    }
  }

  async confirm() {
    this.inProgress = true;
    this.codeError = null;
    this.error = null;
    try {
      const response: any = await this.client.post(
        'api/v2/blockchain/rewards/confirm',
        {
          number: this.number,
          code: this.code,
          secret: this.secret,
        }
      );
      this.confirmed = true;
      this.session.getLoggedInUser().rewards = true;
    } catch (e) {
      this.codeError = e.message;
    }

    this.inProgress = false;
  }

  reset() {
    this.confirming = false;
    this.inProgress = false;
    this.code = null;
    this.secret = null;
    this.error = null;
    this.numberError = null;
    this.codeError = null;
  }
}
