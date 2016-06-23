import { Component } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';
import { CORE_DIRECTIVES } from '@angular/common';
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
