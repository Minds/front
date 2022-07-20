import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { FormToastService } from '../../../../common/services/form-toast.service';

/**
 * Settings form with a button for deactivating account
 * (but not deleting it)
 */
@Component({
  selector: 'm-settingsV2__deactivateAccount',
  templateUrl: './deactivate-account.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsV2DeactivateAccountComponent implements OnInit {
  inProgress: boolean = false;
  form;

  constructor(
    protected cd: ChangeDetectorRef,
    public client: Client,
    public router: Router,
    protected toasterService: FormToastService
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
    this.client
      .delete('api/v1/channel')
      .then((response: any) => {
        this.router.navigate(['/logout']);
      })
      .catch((e: any) => {
        this.toasterService.error('Sorry, we could not disable your account');
        this.detectChanges();
      });
  }

  // delete() {
  //   if (
  //     !confirm(
  //       'Your account and all data related to it will be deleted permanently. Are you sure you want to proceed?'
  //     )
  //   ) {
  //     return;
  //   }
  //   const creator = this.overlayModal.create(
  //     ConfirmPasswordModalComponent,
  //     {},
  //     {
  //       class: 'm-overlay-modal--small',
  //       onComplete: ({ password }) => {
  //         this.client
  //           .post('api/v2/settings/delete', { password })
  //           .then((response: any) => {
  //             this.router.navigate(['/logout']);
  //           })
  //           .catch((e: any) => {
  //             this.toasterService.error('Sorry, we could not delete your account');
  //           });
  //       },
  //     }
  //   );
  //   creator.present();
  // }

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
