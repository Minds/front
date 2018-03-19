import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DynamicHostDirective } from '../../common/directives/dynamic-host.directive';
import { NotificationService } from './notification.service';

@Component({
  selector: 'm-notifications--toaster',
  template: `
    <div class="m-notifications--toaster" *ngIf="notifications">
      <minds-notification
        *ngFor="let notification of notifications"
        class="mdl-card mdl-shadow--4dp item"
        [notification]="notification"
        (click)="closeNotification(notification)"
      ></minds-notification>
    </div>
  `
})

export class NotificationsToasterComponent implements OnInit {
  @Input() notifications: Array<any> = [];

  @ViewChild(DynamicHostDirective) host: DynamicHostDirective;

  constructor(public notification: NotificationService) {
  }

  ngOnInit() {
    this.listenForNotifications();
  }

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