import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { FeaturesService } from '../../../services/features.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';
import { Router } from '@angular/router';
import { AbstractSubscriberComponent } from '../../../common/components/abstract-subscriber/abstract-subscriber.component';

export type Source = 'auth-modal' | 'other' | null;

@Component({
  moduleId: module.id,
  selector: 'minds-form-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.ng.scss'],
})
export class LoginForm extends AbstractSubscriberComponent implements OnInit {
  @Input() showBigButton: boolean = false;
  @Input() showInlineErrors: boolean = false;
  @Input() showTitle: boolean = false;
  @Input() showLabels: boolean = false;
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

  form: FormGroup;

  // Taken from advice in https://stackoverflow.com/a/1373724
  private emailRegex: RegExp = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );

  constructor(
    public session: Session,
    public client: Client,
    fb: FormBuilder,
    private zone: NgZone,
    private userAvatarService: UserAvatarService,
    private featuresService: FeaturesService,
    private authModal: AuthModalService,
    private router: Router
  ) {
    super();
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
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
      if (this.showInlineErrors) {
        this.usernameError = 'LoginException::UsernameRequired';
      } else {
        this.errorMessage = 'LoginException::UsernameRequired';
      }
      return;
    }

    if (this.emailRegex.test(username)) {
      if (this.showInlineErrors) {
        this.usernameError = 'LoginException::EmailAddress';
      } else {
        this.errorMessage = 'LoginException::EmailAddress';
      }
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
        this.session.login(data.user);
        this.userAvatarService.init();
        this.done.next(data.user);
      })
      .catch(e => {
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
    this.router.navigate(['/forgot-password']);
  }
}
