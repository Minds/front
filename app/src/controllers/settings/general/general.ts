import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES } from 'angular2/common';
import { RouterLink, RouteParams } from "angular2/router";

import { SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api';
import { MDL_DIRECTIVES } from '../../../directives/material';


@Component({
  selector: 'minds-settings-general',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/settings/general/general.html',
  directives: [ CORE_DIRECTIVES, MDL_DIRECTIVES, RouterLink, FORM_DIRECTIVES]
})

export class SettingsGeneral{

  session = SessionFactory.build();
  minds : Minds;
  settings : string;

  error : string = "";
  changed : boolean = false;
  saved : boolean = false;
  inProgress : boolean = false;

  guid : string = "";
  name : string;
  email : string;

  password : string;
  password1 : string;
  password2 : string;


  constructor(public client: Client, public params: RouteParams){
    this.minds = window.Minds;
    if(params.params['guid'] && params.params['guid'] == this.session.getLoggedInUser().guid)
      this.load(true);
    else
      this.load(false);
  }

  load(remote : boolean = false){
    if(!remote){
      var user = this.session.getLoggedInUser();
      this.name = user.name;
    }

    var self = this;
    this.client.get('api/v1/settings/' + this.guid)
      .then((response : any) => {
        self.email = response.channel.email;
      });
  }

  canSubmit() {
    if(!this.changed)
      return false;

    if(this.password && !this.password1 || this.password && !this.password2)
      return false;

    if(this.password1 && !this.password){
      this.error = "You must enter your current password";
      return false;
    }

    if(this.password1 != this.password2){
      this.error = "Your new passwords do not match";
      return false;
    }

    this.error = "";

    return true;
  }

  change(){
    this.changed = true;
    this.saved = false;
  }

  save(){
    var self = this;
    if(!this.canSubmit())
      return;

    this.inProgress = true;
    this.client.post('api/v1/settings/' + this.guid,
      {
        name: this.name,
        email: this.email,
        password: this.password,
        new_password: this.password2
      })
      .then((response : any) => {
        self.changed = false;
        self.saved = true;
        self.error = "";

        self.password = "";
        self.password1 = "";
        self.password2 = "";

        self.inProgress = false;
      });
  }
}
