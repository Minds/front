import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ConfirmPasswordModalComponent } from '../../modals/confirm-password/modal.component';
import { PermissionsService } from '../../../common/services/permissions/permissions.service';
import { FeaturesService } from '../../../services/features.service';
import { Flags } from '../../../common/services/permissions/flags';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-settings--disable-channel',
  inputs: ['object'],
  templateUrl: 'disable.component.html',
})
export class SettingsDisableChannelComponent implements OnInit {
  user: any;
  settings: string;
  object: any;
  enabled: boolean = true;

  constructor(
    public client: Client,
    public router: Router,
    private overlayModal: OverlayModalService,
    private session: Session,
    private permissionsService: PermissionsService,
    private featuresService: FeaturesService
  ) {}

  ngOnInit() {
    this.checkPermissions();
  }

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

  private checkPermissions(): void {
    if (this.featuresService.has('permissions')) {
      this.enabled = this.permissionsService.canInteract(
        this.session.getLoggedInUser(),
        Flags.DELETE_CHANNEL
      );
    } else {
      this.enabled = true;
    }
  }
}
