import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  moduleId: module.id,
  selector: 'minds-form-fb-register',
  outputs: ['done'],
  templateUrl: 'fb-register.html'
})

export class FbRegisterForm {

  minds = window.Minds;

  session = SessionFactory.build();
  errorMessage: string = '';

  inProgress: boolean = false;
  referrer: string;

  form: FormGroup;

  done: EventEmitter<any> = new EventEmitter();

  constructor(public client: Client, fb: FormBuilder) {
    this.form = fb.group({
      username: [this.session.getLoggedInUser().username, Validators.required]
    });
  }

  complete(e) {
    e.preventDefault();
    this.errorMessage = '';

    this.inProgress = true;
    this.client.post('api/v1/thirdpartynetworks/facebook/complete-register', this.form.value)
      .then((data: any) => {

        this.inProgress = false;
        this.minds.user.username = this.form.value.username;

        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.done.next(true);
      })
      .catch((e) => {
        console.log(e);
        this.inProgress = false;
        this.errorMessage = e.message;

        return;
      });
  }

}
