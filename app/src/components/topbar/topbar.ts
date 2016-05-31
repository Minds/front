import { Component } from 'angular2/core';
import { CORE_DIRECTIVES } from 'angular2/common';
import { RouterLink } from 'angular2/router';

import { Material } from '../../directives/material';
import { Storage } from '../../services/storage';
import { Sidebar } from '../../services/ui/sidebar';
import { NotificationService } from '../../services/notification';
import { SessionFactory } from '../../services/session';
import { SearchBar } from '../../controllers/search/bar';
import { TopbarNavigation } from './topbar-navigation';
import { Notification } from '../../controllers/notifications/notification';

@Component({
  selector: 'minds-topbar',
  viewBindings: [ Storage, Sidebar ],
  templateUrl: 'src/components/topbar/topbar.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material, SearchBar, TopbarNavigation, Notification ]
})

export class Topbar{

	session = SessionFactory.build();

	constructor(public storage: Storage, public sidebar : Sidebar, public notification: NotificationService){
	}

  ngOnInit() {
    this.listenForNotifications();
  }

	/**
	 * Open the navigation
	 */
	openNav(){
		this.sidebar.open();
	}

  /**
   * Notifications
   */

  notifications: any[] = [];

  listenForNotifications() {
    this.notification.onReceive.subscribe((notification: any) => {
      this.notifications.unshift(notification);

      setTimeout(() => {
        this.closeNotification(notification);
      }, 6000)
    });
  }

  closeNotification(notification: any) {
    for (let i in this.notifications) {
      if (this.notifications[i] == notification) {
        this.notifications.splice(i,1);
      }
    }
  }
}
