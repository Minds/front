import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { Router, RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { Material } from '../../../directives/material';


@Component({
  selector: 'minds-settings-disable-channel',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/settings/disable/disable.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, FORM_DIRECTIVES]
})

export class SettingsDisableChannel{

  minds : Minds;
  user : any;
  settings : string;

  constructor(public client: Client, public router: Router){
    this.minds = window.Minds;
  }

  disable(){
    this.client.delete('api/v1/channel')
      .then((response : any) => {
        this.router.navigate(['/Logout']);
      })
      .catch((e : any) => {
        alert('Sorry, we could not disable your account');
      })
  }

}
