import { Component } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from '@angular/common';
import { Router, RouteParams, RouterLink } from '@angular/router-deprecated';

import { FORM_COMPONENTS } from '../../../components/forms/forms';

import { SignupModalService } from '../../../components/modal/signup/service';
import { MindsTitle } from '../../../services/ux/title';
import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Register } from '../register/register';


@Component({
  selector: 'minds-login',
  providers: [ MindsTitle ],
  templateUrl: 'src/controllers/home/login/login.html',
  directives: [ CORE_DIRECTIVES, FORM_DIRECTIVES, FORM_COMPONENTS, Material, Register, RouterLink]
})

export class Login {

  session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;
  minds = window.Minds;

  form : ControlGroup;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(public client : Client, public router: Router, public params: RouteParams, public title: MindsTitle, private modal : SignupModalService){
    if(this.session.isLoggedIn())
      router.navigate(['/Newsfeed']);

    this.title.setTitle("Login");

    if(params.params['referrer'])
      this.referrer = params.params['referrer'];

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  loggedin(){
    if(this.referrer)
      this.router.navigateByUrl(this.referrer);
    else
      this.router.navigate(['/Newsfeed', {}]);
  }

  registered(){
    this.modal.setDisplay('categories').open();
    this.router.navigate(['/Newsfeed', {}]);
  }

}
