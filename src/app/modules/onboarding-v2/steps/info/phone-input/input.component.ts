import { Component, Input, ViewChild } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { PhoneInputV2Component } from '../../../../../common/components/phone-input-v2/phone-input-v2.component';

@Component({
  selector: 'm-onboarding__phoneVerification',
  templateUrl: 'input.component.html',
})
export class PhoneVerificationComponent {
  @Input() disabled: boolean = false;
  @Input() tooltipAnchor: 'top' | 'left' = 'left';

  number: string;
  code: string; // string because we need to check for starting with 0
  secret: string;

  @Input() error: string;

  numberError: string;
  codeError: string;

  inProgress: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;

  @ViewChild('input') input: PhoneInputV2Component;

  protected resendButtonDisabled: boolean = false;

  constructor(
    private client: Client,
    private session: Session
  ) {}

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

  codeChange(code: string) {
    this.code = code;
    this.error = null;

    if (code.length === 6) {
      this.confirm();
    }
  }

  async reSendCode() {
    this.resendButtonDisabled = true;

    await this.verify();

    setTimeout(() => {
      this.resendButtonDisabled = false;
    }, 3000);
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

  get verifyDisabled() {
    return this.disabled || !this.number || this.number.length <= 1;
  }
}
