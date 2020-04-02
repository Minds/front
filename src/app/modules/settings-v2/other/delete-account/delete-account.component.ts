import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { ConfirmPasswordModalComponent } from '../../../modals/confirm-password/modal.component';

@Component({
  selector: 'm-settingsV2__deleteAccount',
  templateUrl: './delete-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2DeleteAccountComponent implements OnInit {
  inProgress: boolean = false;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    public client: Client,
    public router: Router,
    protected overlayModal: OverlayModalService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      understood: new FormControl('', {
        validators: [Validators.requiredTrue],
      }),
    });

    this.detectChanges();
  }

  submit() {
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
              this.detectChanges();
            });
        },
      }
    );
    creator.present();
  }

  canSubmit(): boolean {
    return this.form.valid && !this.inProgress && !this.form.pristine;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get understood() {
    return this.form.get('understood');
  }
}
