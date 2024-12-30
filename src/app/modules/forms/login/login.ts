import {
  Component,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { Router } from '@angular/router';
import { RegexService } from '../../../common/services/regex.service';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { PermissionsService } from '../../../common/services/permissions.service';
import { SiteService } from '../../../common/services/site.service';
import { AnalyticsService } from '../../../services/analytics';
import { ConfigsService } from '../../../common/services/configs.service';
import { isPlatformBrowser } from '@angular/common';

export type Source = 'auth-modal' | 'other' | null;

/**
 * The login form for users that have already registered on the site.
 *
 * Includes name/password inputs and a link to register
 */
@Component({
  selector: 'm-loginForm',
  templateUrl: 'login.html',
  styleUrls: [
    './login.ng.scss',
    '../../../../stylesheets/two-column-layout.ng.scss',
    '../../../modules/auth/auth.module.ng.scss',
  ],
})
export class LoginForm extends AbstractSubscriberComponent implements OnInit {
  @Input() source: Source = null;

  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() doneRegistered: EventEmitter<any> = new EventEmitter();
  @Output() showRegisterForm: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  hideMFA: boolean = true;
  inProgress: boolean = false;
  referrer: string;

  usernameError: string;

  hasOidcProviders: boolean = false;

  form: UntypedFormGroup;

  /** Whether the login form is loading. */
  protected loadingOidcProviders: boolean = true;

  constructor(
    public session: Session,
    public client: Client,
    fb: UntypedFormBuilder,
    private configService: ConfigsService,
    private userAvatarService: UserAvatarService,
    private router: Router,
    private regex: RegexService,
    private permissionsService: PermissionsService,
    protected site: SiteService,
    protected analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // The browser will need to collect a new XSRF token
      this.configService.loadFromRemote();
    }
    this.subscriptions.push();
  }

  onShowRegisterFormClick() {
    this.showRegisterForm.emit();
  }

  login() {
    if (this.inProgress) {
      return;
    }

    this.usernameError = null;

    let username = this.form.value.username.trim();

    // check for @ char at start, remove it if it is present.
    if (username.charAt(0) === '@') {
      username = username.substring(1);
    }

    if (username === '') {
      this.usernameError = 'LoginException::UsernameRequired';
      return;
    }

    if (this.regex.getRegex('mail').test(username)) {
      this.usernameError = 'LoginException::EmailAddress';
      return;
    }

    // re-enable cookies
    document.cookie =
      'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    this.errorMessage = '';
    this.inProgress = true;

    const opts = {
      username: username,
      password: this.form.value.password,
    };

    this.client
      .post('api/v1/authenticate', opts, {}, true)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;
        this.inProgress = false;

        // Set permissions
        this.permissionsService.setWhitelist(data.permissions);

        if (data.opt_out_analytics) {
          this.analyticsService.setOptOut(data.opt_out_analytics);
        }

        this.session.login(data.user);
        this.userAvatarService.init();
        this.done.next(data.user);
      })
      .catch((e) => {
        this.inProgress = false;

        if (!e) {
          this.errorMessage = 'LoginException::Unknown';
          this.session.logout();
        } else if (e.error?.status === 'failed') {
          // incorrect login details
          this.errorMessage = 'LoginException::AuthenticationFailed';
          this.session.logout();
        } else if (e.error?.status === 'error') {
          this.errorMessage = e.error.message;

          if (e.error.errorId) {
            this.errorMessage = e.error.errorId;
          }

          if (
            e.error.message === 'LoginException:BannedUser' ||
            e.error.message === 'LoginException::AttemptsExceeded'
          ) {
            this.session.logout();
          }
        } else if (e === 'Front::TwoFactorAborted') {
          // do nothing, as the user made this call
        } else {
          this.errorMessage = 'LoginException::Unknown';
        }
      });
  }

  /**
   * Called on join now button clicked.
   * @returns { void }
   */
  public async onJoinNowClick(): Promise<void> {
    this.router.navigate(['/register'], { queryParamsHandling: 'merge' });
  }

  /**
   * Called on forgot password click.
   * @returns { void }
   */
  public onForgotPasswordClick(): void {
    this.done.emit(true);
    this.router.navigate(['/'], { queryParams: { resetPassword: true } });
  }

  /**
   * If oidc providers are found, we will hide the login screen
   */
  public setHasOidcProviders(has: boolean): void {
    this.hideLogin = !!has;
    this.hasOidcProviders = has;
    this.loadingOidcProviders = false;
  }
}
