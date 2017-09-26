import { Component, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { ReCaptchaComponent } from '../../../modules/captcha/recaptcha/recaptcha.component';


@Component({
  moduleId: module.id,
  selector: 'minds-form-register',
  templateUrl: 'register.html'
})

export class RegisterForm {

  session = SessionFactory.build();
  errorMessage: string = '';
  twofactorToken: string = '';
  hideLogin: boolean = false;
  inProgress: boolean = false;
  @Input() referrer: string;
  captcha: string;

  form: FormGroup;
  minds = window.Minds;

  @Output() done: EventEmitter<any> = new EventEmitter();

  @ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  constructor(public client: Client, fb: FormBuilder) {
    this.form = fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      captcha: ['']
    });
  }

  register(e) {
    e.preventDefault();
    this.errorMessage = '';

    if (this.form.value.password !== this.form.value.password2) {
      if (this.reCaptcha) {
        this.reCaptcha.reset();
      }

      this.errorMessage = 'Passwords must match.';
      return;
    }

    this.form.value.referrer = this.referrer;

    this.inProgress = true;
    var self = this; //this <=> that for promises
    this.client.post('api/v1/register', this.form.value)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;
        self.session.login(data.user);

        this.done.next(data.user);
      })
      .catch((e) => {
        console.log(e);
        this.inProgress = false;
        if (this.reCaptcha) {
          this.reCaptcha.reset();
        }

        if (e.status === 'failed') {
          //incorrect login details
          self.errorMessage = 'Incorrect username/password. Please try again.';
          self.session.logout();
        }

        if (e.status === 'error') {
          //two factor?
          self.errorMessage = e.message;
          self.session.logout();
        }

        return;
      });
  }

}
