import { Component, View, CORE_DIRECTIVES, Observable} from 'angular2/angular2';
import { RouterLink } from "angular2/router";
import { Client } from 'src/services/api';
import { SessionFactory } from 'src/services/session';
import { Material } from 'src/directives/material';
import { BUTTON_COMPONENTS } from 'src/components/buttons';

@Component({
  selector: 'minds-card-user',
  viewBindings: [ Client ],
  properties: ['object']
})
@View({
  templateUrl: 'src/controllers/cards/user/user.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, BUTTON_COMPONENTS ]
})

export class UserCard {

  user : any;
  session = SessionFactory.build();
  minds = window.Minds;

	constructor(public client: Client){
	}

  set object(value: any) {
    this.user = value;
  }

}
