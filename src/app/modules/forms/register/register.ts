import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import {
  PopoverComponent,
  SecurityValidationStateValue,
} from '../popover-validation/popover.component';
import { CaptchaComponent } from '../../captcha/captcha.component';
import isMobileOrTablet from '../../../helpers/is-mobile-or-tablet';
import { PASSWORD_VALIDATOR } from '../password.validator';
import { UsernameValidator } from '../username.validator';

export type Source = 'auth-modal' | 'other' | null;

@Component({
  selector: 'minds-form-register',
  templateUrl: 'register.html',
  styleUrls: ['./register.ng.scss'],
})
export class RegisterForm {
  @Input() referrer: string;
  @Input() parentId: string = '';
  @Input() showTitle: boolean = false;
  @Input() showBigButton: boolean = false;
  @Input() showPromotions: boolean = true;
  @Input() showLabels: boolean = false;
  @Input() showInlineErrors: boolean = false;
  @Input() source: Source = null;

  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() showLoginForm: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  captcha: string;
  usernameValidationTimeout: any;
  securityValidationState: SecurityValidationStateValue = null;

  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  showFbForm: boolean = false;

  form: FormGroup;
  fbForm: FormGroup;

  @ViewChild('popover') popover: PopoverComponent;
  @ViewChild(CaptchaComponent) captchaEl: CaptchaComponent;

  constructor(
    public session: Session,
    public client: Client,
    fb: FormBuilder,
    public zone: NgZone,
    private routerHistoryService: RouterHistoryService,
    private usernameValidator: UsernameValidator
  ) {
    this.form = fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50),
          ],
          [this.usernameValidator.existingUsernameValidator()],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            PASSWORD_VALIDATOR,
            //this.passwordSecurityValidator.bind(this),
          ],
        ],
        password2: ['', [Validators.required]],
        tos: [false, Validators.requiredTrue],
        exclusive_promotions: [true],
        captcha: [''],
        previousUrl: this.routerHistoryService.getPreviousUrl(),
      },
      { validators: [this.passwordConfirmingValidator] }
    );
  }

  onShowLoginFormClick() {
    this.showLoginForm.emit();
  }

  showError(field: string) {
    return (
      this.showInlineErrors &&
      this.form.get(field).invalid &&
      this.form.get(field).touched &&
      this.form.get(field).dirty
    );
  }

  passwordConfirmingValidator(c: AbstractControl): ValidationErrors | null {
    if (c.get('password').value !== c.get('password2').value) {
      return { passwordConfirming: true };
    }
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

  register(e) {
    e.preventDefault();
    this.errorMessage = '';
    if (!this.form.value.tos) {
      this.errorMessage =
        'To create an account you need to accept terms and conditions.';
      return;
    }

    // re-enable cookies
    document.cookie =
      'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    if (this.form.value.password !== this.form.value.password2) {
      this.errorMessage = 'Passwords must match.';
      return;
    }

    this.form.value.referrer = this.referrer;
    this.form.value.parentId = this.parentId;

    this.inProgress = true;

    let opts = { ...this.form.value };

    this.client
      .post('api/v1/register', opts)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;
        this.session.login(data.user);
        this.done.next(data.user);
      })
      .catch(e => {
        console.log(e);
        this.inProgress = false;

        this.captchaEl.refresh();

        if (e.status === 'failed') {
          // incorrect login details
          this.errorMessage = 'RegisterException::AuthenticationFailed';
          this.session.logout();
        } else if (e.status === 'error') {
          // two factor?
          switch (e?.message) {
            case 'registration:notemail':
              this.errorMessage = 'Invalid Email';
              break;
            default:
              this.errorMessage = e.message ?? 'An unknown error has occurred';
          }

          this.session.logout();
        } else {
          this.errorMessage = 'Sorry, there was an error. Please try again.';
        }

        return;
      });
  }

  setCaptcha(code) {
    this.form.patchValue({ captcha: code });
  }

  onPasswordFocus() {
    if (this.form.value.password.length > 0) {
      this.popover.show();
    }
  }

  onPasswordBlur() {
    if (!isMobileOrTablet()) {
      this.popover.hide();
    }
    console.log(this.form);
  }

  /**
   * Fired on password validation popover change - emitted around password security checks.
   * @param { SecurityValidationStateValue } state - state of the password security check.
   */
  public onPopoverChange(state: SecurityValidationStateValue): void {
    this.securityValidationState = state;
    this.form.get('password').updateValueAndValidity();
  }

  /**
   * Whether security validation state is successful.
   * @returns { boolean } true if security validation state is successful.
   */
  // public isSecurityValidationStateSuccess(): boolean {
  //   return this.securityValidationState === SecurityValidationState.SUCCESS;
  // }

  get username() {
    return this.form.get('username');
  }
}
