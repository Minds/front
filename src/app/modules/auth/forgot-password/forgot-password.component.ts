import { take } from 'rxjs/operators';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { RegexService } from '../../../common/services/regex.service';
import { FormToastService } from '../../../common/services/form-toast.service';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { ApiResource } from './../../../common/api/api-resource.service';

@Component({
  moduleId: module.id,
  selector: 'm-forgot-password',
  templateUrl: 'forgot-password.component.html',
})
export class ForgotPasswordComponent {
  step: number = 1;
  username: string = '';
  code: string = '';
  paramsSubscription: Subscription;
  forgotPasswordRequest = this.apiResource.mutation(
    'api/v1/forgotpassword/request'
  );
  forgotPasswordReset = this.apiResource.mutation(
    'api/v1/forgotpassword/reset'
  );
  inProgress = combineLatest([
    this.forgotPasswordRequest.loading$,
    this.forgotPasswordReset.loading$,
  ]);

  private errorTexts: { [key: string]: string } = {
    'email-detected': 'Enter your username, not your email.',
    default:
      'There was a problem trying to reset your password. Please try again.',
  };

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public session: Session,
    public regex: RegexService,
    public toaster: FormToastService,
    private pageLayout: PageLayoutService,
    private apiResource: ApiResource
  ) {}

  ngOnInit() {
    this.pageLayout.useFullWidth();
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['code']) {
        this.setCode(params['code']);
      }

      if (params['username']) {
        this.username = params['username'];
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
    const regex: RegExp = this.regex.getRegex('mail');
    regex.lastIndex = 0; // reset state because of global modifier

    if (regex.test(username.value)) {
      this.toaster.error(this.errorTexts['email-detected']);
      return;
    }

    // strip @ character from start if entered.
    let usernameValue = username.value;
    if (usernameValue.charAt(0) === '@') {
      usernameValue = usernameValue.substr(1);
    }

    try {
      await this.forgotPasswordRequest.mutate({
        username: usernameValue,
      });

      username.value = '';
      this.step = 2;
    } catch (e) {
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

  async reset(password) {
    if (!(await this.inProgress.pipe(take(1)).toPromise())) {
      return this.forgotPasswordReset
        .mutate({
          password: password.value,
          code: this.code,
          username: this.username,
        })
        .then((response: any) => {
          this.session.login(response.user);
          this.router.navigate(['/newsfeed']);
        })
        .catch(e => {
          this.toaster.error(e.message);
        });
    }
  }
}
