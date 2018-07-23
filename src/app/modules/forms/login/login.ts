import { Component, EventEmitter, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';


@Component({
  moduleId: module.id,
  selector: 'minds-form-login',
  outputs: ['done', 'doneRegistered'],
  templateUrl: 'login.html'
})

export class LoginForm {

  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  referrer: string;
  minds = window.Minds;

  form: FormGroup;

  done: EventEmitter<any> = new EventEmitter();
  doneRegistered: EventEmitter<any> = new EventEmitter();

  constructor(public session: Session, public client: Client, fb: FormBuilder, private zone: NgZone) {

    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  }

  login() {
    if (this.inProgress)
      return;

    //re-enable cookies
    document.cookie = 'disabled_cookies=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    this.errorMessage = '';
    this.inProgress = true;
    this.client.post('api/v1/authenticate', { username: this.form.value.username, password: this.form.value.password })
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;
        this.inProgress = false;
        this.session.login(data.user);
        this.done.next(data.user);
      })
      .catch((e) => {

        this.inProgress = false;
        if (e.status === 'failed') {
          //incorrect login details
          this.errorMessage = 'LoginException::AuthenticationFailed';
          this.session.logout();
        }

        if (e.status === 'error') {
          if (e.message === 'LoginException:BannedUser' || e.message === 'LoginException::AttemptsExceeded') {
            this.session.logout();
          }

          //two factor?
          this.twofactorToken = e.message;
          this.hideLogin = true;
        }

      });
  }

  twofactorAuth(code) {
    this.client.post('api/v1/twofactor/authenticate', { token: this.twofactorToken, code: code.value })
      .then((data: any) => {
        this.session.login(data.user);
        this.done.next(data.user);
      })
      .catch((e) => {
        this.errorMessage = e.message;
        this.twofactorToken = '';
        this.hideLogin = false;
      });
  }
}
