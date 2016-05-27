import { Component } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators } from 'angular2/common';
import { Router, RouteParams } from 'angular2/router';

import { FORM_COMPONENTS } from '../../../components/forms/forms';

import { SignupModalService } from '../../../components/modal/signup/service';
import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  selector: 'minds-register',
  templateUrl: 'src/controllers/home/register/register.html',
  directives: [ FORM_DIRECTIVES, Material, FORM_COMPONENTS ]
})

export class Register {

  minds = window.Minds;
  session = SessionFactory.build();
  errorMessage : string = "";
  twofactorToken : string = "";
  hideLogin : boolean = false;
  inProgress : boolean = false;
  referrer : string;

  form : ControlGroup;

  flags = {
    canPlayInlineVideos: true
  };

  constructor(public client : Client, public router: Router, public params: RouteParams, private modal : SignupModalService){

    if(params.params['referrer'])
      this.referrer = params.params['referrer'];

    if (/iP(hone|od)/.test(window.navigator.userAgent)) {
      this.flags.canPlayInlineVideos = false;
    }
  }

  registered(){
    this.modal.setDisplay('onboarding').open();
    this.router.navigate(['/Discovery', {filter:'suggested', 'type': 'channels'}]);
  }

}
