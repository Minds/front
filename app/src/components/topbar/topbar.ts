import { Component } from '@angular/core';

import { Storage } from '../../services/storage';
import { Sidebar } from '../../services/ui/sidebar';
import { NotificationService } from '../../modules/notifications/notification.service';
import { SessionFactory } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-topbar',
  templateUrl: 'topbar.html'
})

export class Topbar {

  session = SessionFactory.build();
  notifications: any[] = [];
  minds = window.Minds;

  constructor(public storage: Storage, public sidebar: Sidebar, public notification: NotificationService) {
  }

  ngOnInit() {
    this.listenForNotifications();
  }

	/**
	 * Open the navigation
	 */
  openNav() {
    this.sidebar.open();
  }

  /**
   * Notifications
   */

  listenForNotifications() {
    this.notification.onReceive.subscribe((notification: any) => {
      this.notifications.unshift(notification);

      setTimeout(() => {
        this.closeNotification(notification);
      }, 6000);
    });
  }

  closeNotification(notification: any) {
    let i: any;
    for (i in this.notifications) {
      if (this.notifications[i] === notification) {
        this.notifications.splice(i, 1);
      }
    }
  }

}
