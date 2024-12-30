import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { PopoverComponent } from '../popover-validation/popover.component';
import { CaptchaComponent } from '../../captcha/captcha.component';
import { PASSWORD_VALIDATOR } from '../password.validator';
import { UsernameValidator } from '../username.validator';
import { FriendlyCaptchaComponent } from '../../captcha/friendly-catpcha/friendly-captcha.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { PasswordRiskValidator } from '../password-risk.validator';
import { AnalyticsService } from './../../../services/analytics';
import { debounceTime, Subscription } from 'rxjs';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { SiteService } from '../../../common/services/site.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { UserAvatarService } from '../../../common/services/user-avatar.service';

export type Source = 'auth-modal' | 'other' | null;

/**
 * The register form for users haven't joined Minds yet.
 *
 * Includes inputs and a link to the login form
 */
@Component({
  selector: 'm-registerForm',
  templateUrl: 'register.html',
  styleUrls: [
    './register.ng.scss',
    '../../../../stylesheets/two-column-layout.ng.scss',
    '../../../modules/auth/auth.module.ng.scss',
  ],
})
export class RegisterForm implements OnInit, OnDestroy {
  @Input() referrer: string;
  @Input() parentId: string = '';
  @Input() source: Source = null;

  /**
   * jwt token for users registering via an invite link
   */
  @Input() inviteToken?: string;

  /** Emits on registration done. */
  @Output() done: EventEmitter<any> = new EventEmitter();

  /** Emits when a login is completed rather than registration. */
  @Output() doneLogin: EventEmitter<any> = new EventEmitter();

  @Output() showLoginForm: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  captcha: string;
  usernameValidationTimeout: any;

  passwordRiskCheckStatus: string;

  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  showFbForm: boolean = false;

  form: UntypedFormGroup;
  fbForm: UntypedFormGroup;

  @ViewChild('popover') popover: PopoverComponent;
  @ViewChild(CaptchaComponent) captchaEl: CaptchaComponent;
  @ViewChild(FriendlyCaptchaComponent)
  friendlyCaptchaEl: FriendlyCaptchaComponent;

  /** Whether the register form is loading. */
  protected loadingOidcProviders: boolean = true;

  private passwordInputHasFocus: boolean = false;

  // subscriptions.
  private passwordPopoverSubscription: Subscription;
  private passwordRiskCheckStatusSubscription: Subscription;
  private usernameTouchedSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public fb: UntypedFormBuilder,
    public zone: NgZone,
    private experiments: ExperimentsService,
    private routerHistoryService: RouterHistoryService,
    private usernameValidator: UsernameValidator,
    private passwordRiskValidator: PasswordRiskValidator,
    private analytics: AnalyticsService,
    private onboardingV5Service: OnboardingV5Service,
    private permissionsService: PermissionsService,
    protected site: SiteService,
    private isTenant: IsTenantService,
    private userAvatarService: UserAvatarService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        username: [
          '',
          // sync
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(50),
          ],
          // async
          [this.usernameValidator.existingUsernameValidator()],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          // sync
          [Validators.required, PASSWORD_VALIDATOR],
          // async
          [this.passwordRiskValidator.riskValidator()],
        ],
        password2: ['', [Validators.required]],
        tos: [false, Validators.requiredTrue],
        policies: [false, this.getPoliciesCheckboxValidators()],
        exclusive_promotions: [true],
        captcha: ['', Validators.required],
        previousUrl: this.routerHistoryService.getPreviousUrl(),
      },
      { validators: [this.passwordsMatchValidator] }
    );

    this.passwordPopoverSubscription = this.form
      .get('password')
      .valueChanges.subscribe((str) => {
        if (str.length === 0) {
          this.popover.hide();
        } else {
          setTimeout(() => {
            // check length again after timeout and whether element still has focus.
            if (this.passwordInputHasFocus && str.length > 0) {
              this.popover.show();
            }
          }, 350);
        }
      });

    this.passwordRiskCheckStatusSubscription = this.form
      .get('password')
      .statusChanges.subscribe((status: any) => {
        this.passwordRiskCheckStatus = status;

        if (status === 'VALID') {
          this.popover.hideWithDelay();
        }
      });

    this.usernameTouchedSubscription = this.form
      .get('username')
      .valueChanges.pipe(debounceTime(450))
      .subscribe((username: string) => {
        const usernameField: AbstractControl<string> =
          this.form.get('username');
        if (!username) {
          usernameField.markAsUntouched();
          return;
        }
        usernameField.markAsTouched();
      });
  }

  ngOnDestroy(): void {
    this.passwordPopoverSubscription?.unsubscribe();
    this.passwordRiskCheckStatusSubscription?.unsubscribe();
    this.usernameTouchedSubscription?.unsubscribe();
  }

  /**
   * Only tenant sites need to check the policies checkbox
   */
  private getPoliciesCheckboxValidators() {
    return this.isTenant.is() ? [Validators.requiredTrue] : [];
  }

  // Confirm the two passwords match each other
  passwordsMatchValidator(c: AbstractControl): ValidationErrors | null {
    if (c.get('password').value !== c.get('password2').value) {
      return { passwordsMatch: true };
    }
  }

  register(e) {
    e.preventDefault();
    this.errorMessage = '';
    if (!this.form.value.tos) {
      this.errorMessage =
        'To create an account you need to accept terms and conditions.';
      return;
    }

    if (this.isTenant.is() && !this.form.value.policies) {
      this.errorMessage =
        'To create an account you need to accept the content and privacy policies.';
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
    this.form.value.invite_token = this.inviteToken;

    this.inProgress = true;

    let opts = { ...this.form.value };

    this.client
      .post('api/v1/register', opts)
      .then(async (data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;

        // Set permissions
        this.permissionsService.setWhitelist(data.permissions);

        // Set completed state to false. Modal showing is delegated to app component
        // subscription to login state so that we do not call to open the modal twice.
        try {
          await this.onboardingV5Service.setOnboardingCompletedState(
            false,
            data.user
          );
        } catch (e) {
          console.error(e);
        }

        this.session.login(data.user);
        this.userAvatarService.init();
        this.done.next(data.user);
      })
      .catch((e) => {
        this.inProgress = false;

        // refresh CAPTCHA.
        this.friendlyCaptchaEl.reset();

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

  onPasswordFocus() {
    this.passwordInputHasFocus = true;
    if (
      this.passwordRiskCheckStatus !== 'VALID' &&
      this.form.value.password.length > 0
    ) {
      this.popover.show();
    }
  }

  onPasswordBlur() {
    this.passwordInputHasFocus = false;
    this.popover.hide();
  }

  onShowLoginFormClick() {
    this.showLoginForm.emit();
  }

  setCaptcha(code) {
    this.form.patchValue({ captcha: code });
  }

  showError(field: string) {
    return (
      this.form.get(field).invalid &&
      this.form.get(field).touched &&
      this.form.get(field).dirty
    );
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  public trackView(): void {
    this.analytics.trackView('signup:start');
  }

  public setHasOidcProviders(has: boolean): void {
    this.hideLogin = !!has;
    this.loadingOidcProviders = false;
  }
}
