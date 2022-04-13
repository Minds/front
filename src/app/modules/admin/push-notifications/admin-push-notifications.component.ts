import { Component } from '@angular/core';

export type NotificationDetails = {
  title: string;
  message: string;
  link: string;
  timestamp: number;
};

@Component({
  selector: 'm-admin--pushNotifications',
  styleUrls: ['admin-push-notifications.component.ng.scss'],
  templateUrl: './admin-push-notifications.component.html',
})
export class AdminPushNotificationsComponent {
  constructor() {}
}
