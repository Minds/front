import { Component, View, Inject } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { Material } from '../../../directives/material';


@Component({
  selector: 'minds-settings-two-factor',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/settings/two-factor/two-factor.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, FORM_DIRECTIVES]
})

export class SettingsTwoFactor{

  minds : Minds;
  user : any;
  settings : string;

  constructor(public client: Client){
    this.minds = window.Minds;
  }

  send(smsNumber : any){

  }
}
