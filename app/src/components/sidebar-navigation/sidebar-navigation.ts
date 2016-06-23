import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { RouterLink } from '@angular/router-deprecated';

import { Navigation as NavigationService } from '../../services/navigation';
import { SessionFactory } from '../../services/session';
import { SocketsService } from '../../services/sockets';


@Component({
  selector: 'minds-sidebar-navigation',
  viewProviders: [NavigationService ],
  templateUrl: 'src/components/sidebar-navigation/sidebar-navigation.html',
  directives: [ RouterLink, CORE_DIRECTIVES ]
})

export class SidebarNavigation {
	user;
	session = SessionFactory.build();
	items;

	constructor(public navigation : NavigationService, public sockets : SocketsService){
		var self = this;
    this.items = navigation.getItems('sidebar');
		this.getUser();

		//listen out for new messages
    //this.messengerListener();
	}

	getUser(){
		var self = this;
		this.user = this.session.getLoggedInUser((user) => {
				self.user = user;
			});
	}

  messengerListener(){
    this.sockets.subscribe('messageReceived', (from_guid, message) => {
      if(message.type != "message"){
        return;
      }
      this.navigation.setCounter("Messenger", 1);
    });
  }
}
