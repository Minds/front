import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-register',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/home/register/register.html',
  directives: [ FORM_DIRECTIVES, Material ]
})

export class Register {

	session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;

	constructor(public client : Client, public router: Router, public params: RouteParams, fb: FormBuilder){
    this.form = fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });

    if(params.params['referrer'])
      this.referrer = params.params['referrer'];
	}

	register(e){
    e.preventDefault();
    this.errorMessage = "";

    if(this.form.value.password != this.form.value.password2){
        this.errorMessage = "Passwords must match.";
        return;
    }

    this.inProgress = true;
		var self = this; //this <=> that for promises
		this.client.post('api/v1/register', this.form.value)
			.then((data : any) => {
			  this.form.value = null;

        this.inProgress = false;
				self.session.login(data.user);

        if(this.referrer)
          self.router.navigateByUrl(this.referrer);
        else
				  self.router.navigate(['/Channel', {
            username: data.user.username,
            editToggle: true
          }]);
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
