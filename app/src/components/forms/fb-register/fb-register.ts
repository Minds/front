import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';

import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-form-fb-register',
  outputs: [ 'done' ],
  templateUrl: 'src/components/forms/fb-register/fb-register.html',
  directives: [ FORM_DIRECTIVES, Material ]
})

export class FbRegisterForm {

  minds = window.Minds;

	session = SessionFactory.build();
  errorMessage : string = "";

  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;

  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client, public router: Router, fb: FormBuilder){
    this.form = fb.group({
      username: [ this.session.getLoggedInUser().username , Validators.required]
    });
	}

	complete(e){
    e.preventDefault();
    this.errorMessage = "";

    this.inProgress = true;
		this.client.post('api/v1/thirdpartynetworks/facebook/complete-register', this.form.value)
			.then((data : any) => {

        this.inProgress = false;
        this.minds.user.username = this.form.value.username;

        this.form.value = null;

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
