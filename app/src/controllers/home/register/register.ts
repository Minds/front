import { Component, View, Inject } from 'angular2/angular2';
import { Router } from 'angular2/router';
import { Material } from 'src/directives/material';
import { Client } from 'src/services/api';
import { SessionFactory } from 'src/services/session';

@Component({
  selector: 'minds-register',
  viewBindings: [ Client ]
})
@View({
  templateUrl: 'src/controllers/home/register/register.html',
  directives: [ Material ]
})

export class Register {

	session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;

	constructor(public client : Client, @Inject(Router) public router: Router){
		window.componentHandler.upgradeDom();
	}

	register(username, password, passwordConfirm, email){
    this.errorMessage = "";

    if (!username.value || !username.value.trim()){
      this.errorMessage = "Username cannot be empty.";
      return;
    }
    if (!email.value || !email.value.trim()){
      this.errorMessage = "Email cannot be empty.";
      return;
    }
    if (!password.value || !password.value.trim()){
      this.errorMessage = "Password cannot be empty.";
      return;
    }
    if(password.value != passwordConfirm.value){
        this.errorMessage = "Passwords must match.";
        return;
    }

    this.inProgress = true;
		var self = this; //this <=> that for promises
		this.client.post('api/v1/register', {username: username.value, password: password.value, email: email.value})
			.then((data : any) => {
				username.value = '';
				password.value = '';
        passwordConfirm.value = '';
        email.value = '';

        this.inProgress = false;
				self.session.login(data.user);
				self.router.navigate(['/Newsfeed', {}]);
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

			});
	}

}
