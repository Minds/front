import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { UsernameValidator } from '../username.validator';
import { PasswordRiskValidator } from '../password-risk.validator';
import { debounceTime, Subscription } from 'rxjs';
import { OnboardingV5Service } from '../../onboarding-v5/services/onboarding-v5.service';
import { OnboardingV5ExperimentService } from '../../experiments/sub-services/onboarding-v5-experiment.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { SiteService } from '../../../common/services/site.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { OidcUser } from '../../auth/modal/auth-modal.component';

export type Source = 'auth-modal' | 'other' | null;

/**
 * The form that gets users registering via oidc
 * to create a username
 */
@Component({
  moduleId: module.id,
  selector: 'm-oidcUsernameForm',
  templateUrl: 'oidc-username-form.html',
  styleUrls: [
    './oidc-username-form.ng.scss',
    '../../../../stylesheets/two-column-layout.ng.scss',
    '../../../modules/auth/auth.module.ng.scss',
  ],
})
export class OidcUsernameFormComponent implements OnInit, OnDestroy {
  @Input() oidcUser: OidcUser;
  @Output() done: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  inProgress: boolean = false;
  usernameValidationTimeout: any;

  alphanumericPattern = '^[a-zA-Z0-9_]+$';

  form: UntypedFormGroup;
  fbForm: UntypedFormGroup;

  // subscriptions.
  private usernameTouchedSubscription: Subscription;

  constructor(
    public session: Session,
    public client: Client,
    public fb: UntypedFormBuilder,
    public zone: NgZone,
    private routerHistoryService: RouterHistoryService,
    private usernameValidator: UsernameValidator,
    private passwordRiskValidator: PasswordRiskValidator,
    private onboardingV5Service: OnboardingV5Service,
    private onboardingV5ExperimentService: OnboardingV5ExperimentService,
    private permissionsService: PermissionsService,
    protected site: SiteService,
    private isTenant: IsTenantService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
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
      previousUrl: this.routerHistoryService.getPreviousUrl(),
    });

    this.usernameTouchedSubscription = this.form
      .get('username')
      .valueChanges.pipe(debounceTime(450))
      .subscribe((username: string) => {
        const usernameField: AbstractControl<string> = this.form.get(
          'username'
        );
        if (!username) {
          usernameField.markAsUntouched();
          return;
        }
        usernameField.markAsTouched();
      });
  }

  ngOnDestroy(): void {
    this.usernameTouchedSubscription?.unsubscribe();
  }

  register(e) {
    e.preventDefault();
    this.errorMessage = '';

    // re-enable cookies
    document.cookie =
      'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    this.inProgress = true;

    // ojm this is made up,
    // ojm probs need to use this.user.sub in opts
    let opts = { ...this.form.value };
    this.client
      .post('api/v3/oidc/authenticate/username', opts)
      .then(async (data: any) => {
        this.inProgress = false;

        // Set permissions
        this.permissionsService.setWhitelist(data.permissions);

        // If onboarding v5 is globally enabled, and enrollment is enabled,
        // set completed state to false. Modal showing is delegated to app component
        // subscription to login state so that we do not call to open the modal twice.
        if (
          this.onboardingV5ExperimentService.isGlobalOnSwitchActive() &&
          this.onboardingV5ExperimentService.isEnrollmentActive()
        ) {
          try {
            await this.onboardingV5Service.setOnboardingCompletedState(
              false,
              data.user
            );
          } catch (e) {
            console.error(e);
          }
        }

        this.session.login(data.user);
        this.done.next(data.user);
      })
      .catch(e => {
        this.inProgress = false;

        if (e.status === 'failed') {
          // incorrect login details
          this.errorMessage = 'RegisterException::AuthenticationFailed';
          this.session.logout();
        } else if (e.status === 'error') {
          // two factor?
          switch (e?.message) {
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
}
