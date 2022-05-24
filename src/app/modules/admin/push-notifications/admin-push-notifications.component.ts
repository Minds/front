import { Component } from '@angular/core';

export type NotificationDetails = {
  title: string;
  message: string;
  link: string;
  timestamp: number;
  counter: number | null;
  successful_counter: number | null;
  failed_counter: number | null;
  skipped_counter: number | null;
  target: string;
  status: string;
};

@Component({
  selector: 'm-admin--pushNotifications',
  styleUrls: ['admin-push-notifications.component.ng.scss'],
  templateUrl: './admin-push-notifications.component.html',
})
export class AdminPushNotificationsComponent {
  constructor() {}
}
