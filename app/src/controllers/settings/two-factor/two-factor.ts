import { Component, View, NgFor, NgIf, NgClass, Observable, Inject, FORM_DIRECTIVES} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { Material } from 'src/directives/material';

@Component({
  selector: 'minds-settings-two-factor',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/settings/two-factor/two-factor.html',
  directives: [ NgFor, NgIf, NgClass, Material, RouterLink, FORM_DIRECTIVES]
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
