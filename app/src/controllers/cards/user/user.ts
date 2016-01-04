import { Component, View } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from "angular2/router";

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';
import { Material } from '../../../directives/material';
import { BUTTON_COMPONENTS } from '../../../components/buttons';


@Component({
  selector: 'minds-card-user',
  viewBindings: [ Client ],
  properties: ['object', 'avatarSize']
})
@View({
  templateUrl: 'src/controllers/cards/user/user.html',
  directives: [ CORE_DIRECTIVES, Material, RouterLink, BUTTON_COMPONENTS ]
})

export class UserCard {

  user : any;
  session = SessionFactory.build();
  minds = window.Minds;
  avatarSize : string = 'medium';

	constructor(public client: Client){
	}

  set object(value: any) {
    this.user = value;
  }

}
