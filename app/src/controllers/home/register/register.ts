import { Component, View, Inject, ControlGroup, FormBuilder, Validators, FORM_DIRECTIVES  } from 'angular2/angular2';
import { Router } from 'angular2/router';
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

  form : ControlGroup;

	constructor(public client : Client, public router: Router, fb: FormBuilder){
    this.form = fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required]
    });
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
				self.router.navigate(['/Channel', {username: data.user.username}]);
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
