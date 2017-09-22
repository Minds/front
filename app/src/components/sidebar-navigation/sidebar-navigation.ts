import { Component, EventEmitter } from '@angular/core';

import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';
import { SocketsService } from '../../services/sockets';

@Component({
	moduleId: module.id,
	selector: 'minds-sidebar-navigation',
	templateUrl: 'sidebar-navigation.html'
})

export class SidebarNavigation {
	user;
	session = SessionFactory.build();
	items;

	constructor(public navigation: NavigationService, public sockets: SocketsService) {
		var self = this;
		this.items = navigation.getItems('sidebar');
		this.getUser();

		//listen out for new messages
		//this.messengerListener();
	}

	getUser() {
		var self = this;
		this.user = this.session.getLoggedInUser((user) => {
			self.user = user;
		});
	}

	messengerListener() {
		this.sockets.subscribe('messageReceived', (from_guid, message) => {
			if (message.type !== 'message') {
				return;
			}
			this.navigation.setCounter('Messenger', 1);
		});
	}
}
