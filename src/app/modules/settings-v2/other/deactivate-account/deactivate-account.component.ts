import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import { Client } from '../../../../services/api';
import { Router } from '@angular/router';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

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
    protected toasterService: ToasterService,
    private session: Session,
    @Inject(IS_TENANT_NETWORK) public isTenant: boolean
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      understood: new UntypedFormControl('', {
        validators: [Validators.requiredTrue],
      }),
    });

    this.detectChanges();
  }

  submit() {
    this.inProgress = true;
    this.client
      .delete('api/v1/channel')
      .then((response: any) => {
        this.toasterService.success('Successfully deactivated channel');
        this.session.logout();
        this.router.navigateByUrl('/login');
      })
      .catch((e: any) => {
        this.toasterService.error('Sorry, we could not disable your account');
      })
      .finally(() => {
        this.inProgress = false;
        this.detectChanges();
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
