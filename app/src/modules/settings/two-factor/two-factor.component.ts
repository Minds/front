import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-settings--two-factor',
  inputs: ['object'],
  templateUrl: 'two-factor.component.html'
})

export class SettingsTwoFactorComponent {

  minds: Minds;
  telno: number;
  secret;
  waitingForCheck: boolean = false;
  sendingSms: boolean = false;
  object: any;

  inProgress: boolean = false;
  error: string = '';

  constructor(public client: Client) {
    this.minds = window.Minds;
    this.load();
  }

  load() {
    this.inProgress = true;
    this.client.get('api/v1/twofactor')
      .then((response: any) => {
        if (response.telno)
          this.telno = response.telno;
        this.inProgress = false;
      });
  }

  setup(smsNumber: any) {
    this.telno = smsNumber;
    this.waitingForCheck = true;
    this.sendingSms = true;
    this.error = '';
    this.client.post('api/v1/twofactor/setup', { tel: smsNumber })
      .then((response: any) => {
        this.secret = response.secret;
        this.sendingSms = false;
      })
      .catch(() => {
        this.waitingForCheck = false;
        this.sendingSms = false;
        this.telno = null;
        this.error = 'The phone number you entered was incorrect. Please, try again.';
      });
  }

  check(code: number) {
    this.client.post('api/v1/twofactor/check/' + this.secret, {
      code: code,
      telno: this.telno
    })
      .then((response: any) => {
        this.waitingForCheck = false;
      })
      .catch((response: any) => {
        this.waitingForCheck = false;
        this.telno = null;
        this.error = 'The code was incorrect. Please, try again.';
      });
  }

  retry() {
    this.telno = null;
    this.waitingForCheck = false;
  }

  cancel() {
    this.client.delete('api/v1/twofactor');
    this.telno = null;
    this.error = '';
  }

}
