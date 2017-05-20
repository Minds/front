import { Component, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  moduleId: module.id,
  selector: 'minds-form-register',
  inputs: [ 'referrer' ],
  outputs: [ 'done' ],
  templateUrl: 'register.html'
})

export class RegisterForm {

	session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;

  form : FormGroup;

  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client, fb: FormBuilder){
    this.form = fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      password3: ['']
    });
	}

	register(e){
    e.preventDefault();
    this.errorMessage = "";

    if(this.form.value.password != this.form.value.password2){
        this.errorMessage = "Passwords must match.";
        return;
    }

    this.form.value.referrer = this.referrer;

    this.inProgress = true;
		var self = this; //this <=> that for promises
		this.client.post('api/v1/register', this.form.value)
			.then((data : any) => {
			  // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;
				self.session.login(data.user);

        this.done.next(data.user);
			})
			.catch((e) => {
        console.log(e);
        this.inProgress = false;
        if(e.status == 'failed'){
          //incorrect login details
          self.errorMessage = "Incorrect username/password. Please try again.";
          self.session.logout();
        }

        if(e.status == 'error'){
          //two factor?
          self.errorMessage = e.message;
          self.session.logout();
        }

        return;
			});
	}

}
