import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { Session } from '../../../../services/session';
import { DialogService } from '../../../../common/services/confirm-leave-dialog.service';
import { Observable } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';

import { SettingsV2Service } from '../../settings-v2.service';
import {
  PopoverComponent,
  SecurityValidationState,
  SecurityValidationStateValue,
} from '../../../forms/popover-validation/popover.component';
import isMobileOrTablet from '../../../../helpers/is-mobile-or-tablet';
import { Router } from '@angular/router';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { PASSWORD_VALIDATOR } from '../../../forms/password.validator';

@Component({
  selector: 'm-settingsV2__password',
  templateUrl: './password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./password.component.ng.scss'],
})
export class SettingsV2PasswordComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter();

  @ViewChild('popover')
  popover: PopoverComponent;

  init: boolean = false;
  inProgress: boolean = false;
  user: MindsUser;
  form;
  passwordIncorrect: boolean = false;
  securityValidationState: SecurityValidationStateValue = null;

  constructor(
    protected cd: ChangeDetectorRef,
    private session: Session,
    protected settingsService: SettingsV2Service,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    this.form = new FormGroup({
      password: new FormControl('', {
        validators: [Validators.required],
      }),
      newPassword: new FormControl('', {
        validators: [
          Validators.required,
          PASSWORD_VALIDATOR,
          // this.passwordSecurityValidator.bind(this),
        ],
      }),
      confirmNewPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    });

    this.form.setValidators(this.validatePasswordMatch());

    this.form.get('password').valueChanges.subscribe(val => {
      if (this.passwordIncorrect) {
        this.passwordIncorrect = false;
        this.detectChanges();
      }
    });
    this.form
      .get('newPassword')
      .valueChanges.pipe(distinctUntilChanged())
      .subscribe(val => {
        this.popover.show();
        if (val && val.length > 0) {
          this.popover.checkRules(val);
        } else {
          this.popover.hide();
        }
      });

    this.init = true;
    this.detectChanges();
  }

  async submit() {
    if (!this.canSubmit()) {
      return;
    }
    try {
      this.inProgress = true;
      this.passwordIncorrect = false;
      this.detectChanges();

      const formValue = {
        password: this.password.value,
        new_password: this.newPassword.value,
      };

      const response: any = await this.settingsService.updateSettings(
        this.user.guid,
        formValue
      );
      if (response.status === 'success') {
        this.router.navigate(['/login']);
      } else {
        this.passwordIncorrect = true;
      }
    } catch (e) {
      this.passwordIncorrect = true;
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  validatePasswordMatch(): ValidatorFn {
    return (f: FormGroup): ValidationErrors => {
      const newPassword = f.controls['newPassword'];
      const confirmNewPassword = f.controls['confirmNewPassword'];
      if (newPassword.value !== confirmNewPassword.value) {
        confirmNewPassword.setErrors({ passwordMatch: true });
      } else {
        confirmNewPassword.setErrors(null);
      }
      return;
    };
  }

  /**
   * Check if the password security check has failed, return error if it has.
   * We ignore pending state here because we don't want to trigger form errors when pending.
   * @param { AbstractControl } control - specifies the form control - unused.
   * @returns { ValidationErrors | null } - returns validation errors in the event the state is failed.
   */
  // private passwordSecurityValidator(
  //   control: AbstractControl
  // ): ValidationErrors | null {
  //   return this.securityValidationState === SecurityValidationState.FAILED
  //     ? { passwordSecurityFailed: true }
  //     : null;
  // }

  onNewPasswordFocus() {
    if (this.newPassword.length > 0) {
      this.popover.show();
    }
  }

  onNewPasswordBlur() {
    if (!isMobileOrTablet()) {
      this.popover.hide();
    }
  }

  /**
   * Fired on password validation popover change - emitted around password security checks.
   * @param { SecurityValidationStateValue } state - state of the password security check.
   */
  onPopoverChange(state: SecurityValidationStateValue): void {
    this.securityValidationState = state;
    this.form.get('newPassword').updateValueAndValidity();
  }

  canSubmit(): boolean {
    return (
      this.form.valid &&
      // this.securityValidationState === SecurityValidationState.SUCCESS &&
      !this.passwordIncorrect &&
      !this.inProgress &&
      !this.form.pristine
    );
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.form.pristine) {
      return true;
    }

    return this.dialogService.confirm('Discard changes?');
  }

  showError(field: string) {
    return (
      this.form.get(field).invalid &&
      this.form.get(field).touched &&
      this.form.get(field).dirty
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get password() {
    return this.form.get('password');
  }
  get newPassword() {
    return this.form.get('newPassword');
  }
  get confirmNewPassword() {
    return this.form.get('confirmNewPassword');
  }
}
