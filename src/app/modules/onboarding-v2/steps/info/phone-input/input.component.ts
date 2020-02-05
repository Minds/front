import { Component, Input, OnInit } from '@angular/core';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';

@Component({
  selector: 'm-onboarding__phoneverification',
  templateUrl: 'input.component.html',
})
export class PhoneVerificationComponent implements OnInit {
  @Input() tooltipAnchor: 'top' | 'left' = 'left';

  number: string;
  code: number;
  secret: string;

  numberError: string;
  codeError: string;

  inProgress: boolean = false;
  confirming: boolean = false;
  confirmed: boolean = false;

  constructor(private client: Client, private session: Session) {}

  ngOnInit() {}

  async savePhoneNumber() {
    this.verify();
  }

  async verify() {
    this.inProgress = true;
    this.numberError = null;
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

  codeChange(code: number) {
    this.code = code;

    if (code.toString().length === 6) {
      this.confirm();
    }
  }

  async confirm() {
    this.inProgress = true;
    this.codeError = null;
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
    this.numberError = null;
    this.codeError = null;
  }
}
