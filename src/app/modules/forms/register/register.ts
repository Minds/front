import {
  Component,
  EventEmitter,
  ViewChild,
  Input,
  Output,
  NgZone,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ReCaptchaComponent } from '../../../modules/captcha/recaptcha/recaptcha.component';
import { ExperimentsService } from '../../experiments/experiments.service';
import { RouterHistoryService } from '../../../common/services/router-history.service';
import { PopoverComponent } from '../popover-validation/popover.component';

@Component({
  moduleId: module.id,
  selector: 'minds-form-register',
  templateUrl: 'register.html',
})
export class RegisterForm {
  @Input() referrer: string;
  @Input() parentId: string = '';
  @Input() showTitle: boolean = false;
  @Input() showBigButton: boolean = false;
  @Input() showPromotions: boolean = true;
  @Input() showLabels: boolean = false;

  @Output() done: EventEmitter<any> = new EventEmitter();

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  captcha: string;
  takenUsername: boolean = false;
  usernameValidationTimeout: any;

  showFbForm: boolean = false;

  form: FormGroup;
  fbForm: FormGroup;
  minds = window.Minds;

  @ViewChild('reCaptcha', { static: false }) reCaptcha: ReCaptchaComponent;
  @ViewChild('popover', { static: false }) popover: PopoverComponent;

  constructor(
    public session: Session,
    public client: Client,
    fb: FormBuilder,
    public zone: NgZone,
    private experiments: ExperimentsService,
    private routerHistoryService: RouterHistoryService
  ) {
    this.form = fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      tos: [false],
      exclusive_promotions: [false],
      captcha: [''],
      previousUrl: this.routerHistoryService.getPreviousUrl(),
    });
  }

  ngOnInit() {
    if (this.reCaptcha) {
      this.reCaptcha.reset();
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

    //re-enable cookies
    document.cookie =
      'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    if (this.form.value.password !== this.form.value.password2) {
      if (this.reCaptcha) {
        this.reCaptcha.reset();
      }

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
        if (this.reCaptcha) {
          this.reCaptcha.reset();
        }

        if (e.status === 'failed') {
          //incorrect login details
          this.errorMessage = 'RegisterException::AuthenticationFailed';
          this.session.logout();
        } else if (e.status === 'error') {
          //two factor?
          this.errorMessage = e.message;
          this.session.logout();
        } else {
          this.errorMessage = 'Sorry, there was an error. Please try again.';
        }

        return;
      });
  }

  validateUsername() {
    if (this.form.value.username) {
      this.client
        .get('api/v1/register/validate/' + this.form.value.username)
        .then((data: any) => {
          if (data.exists) {
            this.form.controls.username.setErrors({ exists: true });
            this.errorMessage = data.message;
            this.takenUsername = true;
          } else {
            this.takenUsername = false;
            this.errorMessage = '';
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  setCaptcha(code) {
    this.form.patchValue({ captcha: code });
  }

  validationTimeoutHandler() {
    clearTimeout(this.usernameValidationTimeout);
    this.usernameValidationTimeout = setTimeout(
      this.validateUsername.bind(this),
      500
    );
  }

  passwordOnFocus() {
    if (this.form.value.password.length > 0) {
      this.popover.show();
    }
  }

  passwordOnFocusOut() {
    this.popover.hide();
  }
}
