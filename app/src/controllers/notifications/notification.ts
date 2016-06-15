import { Component } from 'angular2/core';
import { RouterLink } from 'angular2/router';
import { CORE_DIRECTIVES } from 'angular2/common';
import { Material } from '../../directives/material';
import { SessionFactory } from '../../services/session';

@Component({
  selector: 'minds-notification',
  inputs: ['_notification: notification'],
  templateUrl: 'src/controllers/notifications/notification.html',
  directives: [ CORE_DIRECTIVES, RouterLink, Material ]
})
export class Notification {
  notification: any;
  session = SessionFactory.build();

  constructor() {
  }

  set _notification(value: any) {
    this.notification = value;
  }
}
