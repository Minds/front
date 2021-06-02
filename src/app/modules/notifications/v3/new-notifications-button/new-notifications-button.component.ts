import { Component, Output, EventEmitter } from '@angular/core';
import { NotificationService } from '../../notification.service';
import { NotificationsV3Service } from '../notifications-v3.service';

@Component({
  selector: 'm-newNotificationsButton',
  templateUrl: './new-notifications-button.component.html',
  styleUrls: ['./new-notifications-button.component.ng.scss'],
})
export class NewNotificationsButtonComponent {
  @Output('loadNew') loadNewEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public v1Service: NotificationService,
    public service: NotificationsV3Service
  ) {}

  loadNewNotifications($event) {
    this.loadNewEmitter.emit();
  }
}
