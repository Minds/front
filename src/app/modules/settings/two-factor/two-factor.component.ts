import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password/modal.component';

@Component({
  moduleId: module.id,
  selector: 'm-settings--two-factor',
  inputs: ['object'],
  templateUrl: 'two-factor.component.html',
})
export class SettingsTwoFactorComponent {
  telno: number;
  secret;
  waitingForCheck: boolean = false;
  sendingSms: boolean = false;
  object: any;

  inProgress: boolean = false;
  error: string = '';

  constructor(
    public client: Client,
    private overlayModal: OverlayModalService
  ) {
    this.load();
  }

  load() {
    this.inProgress = true;
    this.client.get('api/v1/twofactor').then((response: any) => {
      if (response.telno) this.telno = response.telno;
      this.inProgress = false;
    });
  }

  setup(smsNumber: any) {
    this.telno = smsNumber;
    this.waitingForCheck = true;
    this.sendingSms = true;
    this.error = '';
    this.client
      .post('api/v1/twofactor/setup', { tel: smsNumber })
      .then((response: any) => {
        this.secret = response.secret;
        this.sendingSms = false;
      })
      .catch(e => {
        this.waitingForCheck = false;
        this.sendingSms = false;
        this.telno = null;
        if (e.message == 'voip phones not allowed') {
          this.error =
            "We don't allow voip phones. Please, try again with a different number";
        }
        this.error =
          'The phone number you entered was incorrect. Please, try again.';
      });
  }

  check(code: number) {
    this.client
      .post('api/v1/twofactor/check', {
        code: code,
        telno: this.telno,
        secret: this.secret,
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
    const creator = this.overlayModal.create(
      ConfirmPasswordModalComponent,
      {},
      {
        class: 'm-overlay-modal--small',
        onComplete: ({ password }) => {
          this.client.post('api/v1/twofactor/remove', {
            password: password,
          });
          this.telno = null;
          this.error = '';
        },
      }
    );
    creator.present();
  }
}
