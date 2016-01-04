import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from 'angular2/common';
import { Router, RouteParams, RouterLink } from 'angular2/router';

import { MindsTitle } from '../../../services/ux/title';
import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Register } from '../register/register';


@Component({
  selector: 'minds-login',
  viewBindings: [ Client ],
  bindings: [ MindsTitle ]
})
@View({
  templateUrl: 'src/controllers/home/login/login.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, Material, Register, RouterLink]
})

export class Login {

	session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;

	constructor(public client : Client, public router: Router, public params: RouteParams, public title: MindsTitle, fb: FormBuilder){
		if(this.session.isLoggedIn())
      router.navigate(['/Newsfeed']);

    this.title.setTitle("Login");

    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    if(params.params['referrer'])
      this.referrer = params.params['referrer'];
	}

	login(){
    if(this.inProgress)
      return;

    this.errorMessage = "";
    this.inProgress = true;
		var self = this; //this <=> that for promises
		this.client.post('api/v1/authenticate', {username: this.form.value.username, password: this.form.value.password})
			.then((data : any) => {
				this.form.value = null;
        this.inProgress = false;
				this.session.login(data.user);
        if(this.referrer)
          self.router.navigateByUrl(this.referrer);
        else
				  self.router.navigate(['/Newsfeed', {}]);
			})
			.catch((e) => {

        this.inProgress = false;
        if(e.status == 'failed'){
          //incorrect login details
          self.errorMessage = "Incorrect username/password. Please try again.";
          self.session.logout();
        }

        if(e.status == 'error'){
          //two factor?
          self.twofactorToken = e.message;
          self.hideLogin = true;
        }

			});
	}

  twofactorAuth(code){
    var self = this;
    this.client.post('api/v1/authenticate/two-factor', {token: this.twofactorToken, code: code.value})
        .then((data : any) => {
          self.session.login(data.user);
          self.router.navigate(['/Newsfeed', {}]);
        })
        .catch((e) => {
          self.errorMessage = "Sorry, we couldn't verify your two factor code. Please try logging again.";
          self.twofactorToken = "";
          self.hideLogin = false;
        });
  }

}
