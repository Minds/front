import { Component } from '@angular/core';
import { SessionFactory } from '../../services/session';

@Component({
  moduleId: module.id,
  selector: 'minds-notification',
  inputs: ['_notification: notification'],
  templateUrl: 'notification.html'
})
export class Notification {
  notification: any;
  session = SessionFactory.build();

  constructor() {
  }

  set _notification(value: any) {
    this.notification = value;
  }

  openMessengerWindow(event) {
    if (event) {
      event.preventDefault();
    }

    (<any>window).openMessengerWindow();
  }
}
