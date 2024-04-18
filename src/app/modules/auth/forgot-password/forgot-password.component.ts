import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RegexService } from '../../../common/services/regex.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { ResetPasswordExperimentService } from '../../experiments/sub-services/reset-password-experiment.service';

@Component({
  moduleId: module.id,
  selector: 'm-forgot-password',
  templateUrl: 'forgot-password.component.html',
})
export class ForgotPasswordComponent {
  inProgress: boolean = false;
  step: number = 1;
  username: string = '';
  code: string = '';
  paramsSubscription: Subscription;

  private errorTexts: { [key: string]: string } = {
    'email-detected': 'Enter your username, not your email.',
    default:
      'There was a problem trying to reset your password. Please try again.',
  };

  constructor(
    public client: Client,
    public router: Router,
    public route: ActivatedRoute,
    public session: Session,
    public regex: RegexService,
    public toaster: ToasterService,
    private pageLayout: PageLayoutService,
    private resetPasswordExperiment: ResetPasswordExperimentService
  ) {}

  ngOnInit() {
    this.pageLayout.useFullWidth();
    this.paramsSubscription = this.route.params.subscribe((params) => {
      if (this.resetPasswordExperiment.isActive()) {
        let queryParams = {
          resetPassword: true,
        };

        if (params['username'] && params['code']) {
          queryParams['username'] = params['username'];
          queryParams['code'] = params['code'];
        }

        // Go to homepage and open the reset password modal there
        this.router.navigate(['/'], {
          queryParams: queryParams,
        });
      } else {
        if (params['code']) {
          this.setCode(params['code']);
        }

        if (params['username']) {
          this.username = params['username'];
        }
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  /**
   * Request password reset for an email.
   * @param { { value: string } } username - username object to be checked.
   */
  async request(username: { value: string }): Promise<void> {
    this.inProgress = true;

    const regex: RegExp = this.regex.getRegex('mail');
    regex.lastIndex = 0; // reset state because of global modifier

    if (regex.test(username.value)) {
      this.inProgress = false;
      this.toaster.error(this.errorTexts['email-detected']);
      return;
    }

    // strip @ character from start if entered.
    let usernameValue = username.value;
    if (usernameValue.charAt(0) === '@') {
      usernameValue = usernameValue.substr(1);
    }

    try {
      await this.client.post('api/v1/forgotpassword/request', {
        username: usernameValue,
      });

      username.value = '';

      this.inProgress = false;
      this.step = 2;
    } catch (e) {
      this.inProgress = false;
      if (e.status === 'failed') {
        this.toaster.error(this.errorTexts['default']);
      }

      if (e.status === 'error') {
        this.toaster.error(e.message);
      }
    }
  }

  setCode(code: string) {
    this.step = 3;
    this.code = code;
  }

  reset(password) {
    if (!this.inProgress) {
      this.inProgress = true;
      this.client
        .post('api/v1/forgotpassword/reset', {
          password: password.value,
          code: this.code,
          username: this.username,
        })
        .then((response: any) => {
          this.inProgress = false;
          this.session.login(response.user);
          this.router.navigate(['/newsfeed']);
        })
        .catch((e) => {
          this.inProgress = false;
          this.toaster.error(e.message);
        });
    }
  }
}
