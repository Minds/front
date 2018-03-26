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

    this.errorMessage = '';
    this.inProgress = true;
    var self = this; //this <=> that for promises
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
          self.errorMessage = 'Incorrect username/password. Please try again.';
          self.session.logout();
        }

        if (e.status === 'error') {
          if (e.message === 'LoginException:BannedUser') {
            self.errorMessage = 'You are not allowed to login.';
            self.session.logout();
            return;
          } else if (e.message === 'LoginException::AttemptsExceeded') {
            self.errorMessage = 'You have exceeded your login attempts. Please try again in a few minutes.';
            self.session.logout();
            return;
          }

          //two factor?
          self.twofactorToken = e.message;
          self.hideLogin = true;
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
        this.errorMessage = 'Sorry, we couldn\'t verify your two factor code. Please try logging again.';
        this.twofactorToken = '';
        this.hideLogin = false;
      });
  }
}
