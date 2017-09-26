import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
	template: ``
})

export class Logout {

	session = SessionFactory.build();

	constructor(public client: Client, public router: Router) {
		this.logout();
	}

	logout() {
		this.client.delete('api/v1/authenticate');
		this.session.logout();
		this.router.navigate(['/login']);
	}

}
