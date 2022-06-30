import { Component, EventEmitter, Output } from '@angular/core';

import { Client } from '../../../services/api';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password/modal.component';
import { ModalService } from '../../../services/ux/modal.service';

/**
 * Old SMS 2FA settings components that is referenced by the
 * SettingsTwoFactorDisableSMSComponent to allow users
 * to disable SMS 2FA.
 *
 * NOTE: SMS 2FA is deprecated, this component should only shown to users who already have SMS enabled.
 */
@Component({
  moduleId: module.id,
  selector: 'm-settings--two-factor',
  inputs: ['object'],
  templateUrl: 'two-factor.component.html',
})
export class SettingsTwoFactorComponent {
  telno: string;
  number: string;
  secret;
  waitingForCheck: boolean = false;
  sendingSms: boolean = false;
  object: any;

  inProgress: boolean = false;
  error: string = '';

  // emits on save
  @Output('saved') saved: EventEmitter<unknown> = new EventEmitter<unknown>();

  // emits on sms mfa disabled
  @Output('disabled') disabled: EventEmitter<unknown> = new EventEmitter<
    unknown
  >();

  constructor(public client: Client, private modalService: ModalService) {
    this.load();
  }

  load() {
    this.inProgress = true;
    this.client.get('api/v1/twofactor').then((response: any) => {
      if (response.telno) this.telno = response.telno;
      this.inProgress = false;
    });
  }

  numberChange(number: string) {
    this.number = number;
  }

  /**
   * Posts phone number to client and handles component state.
   * @returns { Promise<void> }
   */
  async setup(): Promise<void> {
    try {
      this.telno = this.number;
      const request: Promise<unknown> = this.client.post(
        'api/v1/twofactor/setup',
        { tel: this.telno }
      );
      this.inProgress = true;
      this.sendingSms = true;
      this.waitingForCheck = true;
      this.error = '';

      const response: any = await request;
      this.sendingSms = false;
      this.inProgress = false;
      this.secret = response.secret;
    } catch (e) {
      this.inProgress = false;
      this.sendingSms = false;
      this.waitingForCheck = false;
      this.telno = null;

      if (e.message === 'voip phones not allowed') {
        this.error =
          "We don't allow VOIP phones. Please, try again with a different number.";
        return;
      }
      this.error =
        'An error has occurred, please make sure that the phone number is correct.';
    }
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
        this.saved.emit(true);
      })
      .catch((response: any) => {
        this.waitingForCheck = false;
        this.telno = null;
        this.number = null;
        this.error = 'The code was incorrect. Please, try again.';
      });
  }

  retry() {
    this.telno = null;
    this.waitingForCheck = false;
  }

  cancel() {
    const modal = this.modalService.present(ConfirmPasswordModalComponent, {
      data: {
        onComplete: ({ password }) => {
          this.client.post('api/v1/twofactor/remove', {
            password: password,
          });
          this.telno = null;
          this.error = '';
          this.disabled.emit(true);
          modal.dismiss();
        },
      },
    });
  }
}
