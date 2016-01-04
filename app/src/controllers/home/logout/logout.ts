import { Component, View, Inject } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';

import { Material } from '../../../directives/material';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  viewBindings: [Client]
})
@View({
  template: ``,
  directives: [ Material, ROUTER_DIRECTIVES ]
})

export class Logout {

	session = SessionFactory.build();

	constructor(public client : Client, @Inject(Router) public router: Router){
		this.logout();
	}

	logout(){
		this.client.delete('api/v1/authenticate');
		this.session.logout();
    this.router.navigate(['/Login', {}]);
	}
}
