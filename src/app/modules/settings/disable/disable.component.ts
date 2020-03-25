import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password/modal.component';

@Component({
  moduleId: module.id,
  selector: 'm-settings--disable-channel',
  inputs: ['object'],
  templateUrl: 'disable.component.html',
})
export class SettingsDisableChannelComponent {
  user: any;
  settings: string;
  object: any;

  constructor(
    public client: Client,
    public router: Router,
    private overlayModal: OverlayModalService
  ) {}

  disable() {
    this.client
      .delete('api/v1/channel')
      .then((response: any) => {
        this.router.navigate(['/logout']);
      })
      .catch((e: any) => {
        alert('Sorry, we could not disable your account');
      });
  }

  delete() {
    if (
      !confirm(
        'Your account and all data related to it will be deleted permanently. Are you sure you want to proceed?'
      )
    ) {
      return;
    }
    const creator = this.overlayModal.create(
      ConfirmPasswordModalComponent,
      {},
      {
        class: 'm-overlay-modal--small',
        onComplete: ({ password }) => {
          this.client
            .post('api/v2/settings/delete', { password })
            .then((response: any) => {
              this.router.navigate(['/logout']);
            })
            .catch((e: any) => {
              alert('Sorry, we could not delete your account');
            });
        },
      }
    );
    creator.present();
  }
}
