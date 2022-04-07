import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { ConfirmPasswordModalComponent } from '../../../modals/confirm-password/modal.component';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { ModalService } from '../../../../services/ux/modal.service';

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
    protected modalService: ModalService,
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
    const modal = this.modalService.present(ConfirmPasswordModalComponent, {
      data: {
        onComplete: ({ password }) => {
          this.client
            .post('api/v2/settings/delete', { password })
            .then((response: any) => {
              this.router.navigate(['/logout']);
            })
            .catch((e: any) => {
              this.toasterService.error(
                'Sorry, we could not delete your account'
              );
              this.detectChanges();
            })
            .finally(() => {
              modal.dismiss();
            });
        },
      },
    });
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
