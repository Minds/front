import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../services/api';
import { Session } from '../../services/session';


@Component({
	template: ``
})

export class LogoutComponent {

	constructor(
    public client: Client,
    public router: Router,
    public session: Session
  ) {
		this.logout();
	}

	logout() {
		this.client.delete('api/v1/authenticate');
		this.session.logout();
		this.router.navigate(['/login']);
	}

}
