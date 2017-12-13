import { Component, EventEmitter } from '@angular/core';

import { Navigation as NavigationService } from '../../../services/navigation';
import { Session } from '../../../services/session';

@Component({
	selector: 'm-topbar--navigation',
	templateUrl: 'navigation.component.html'
})

export class TopbarNavigationComponent {

	user;
	items;

	constructor(
		public navigation: NavigationService,
		public session: Session
	) {
		this.items = navigation.getItems('topbar');
		this.getUser();
	}

	getUser() {
		this.user = this.session.getLoggedInUser((user) => {
			this.user = user;
		});
	}

}
