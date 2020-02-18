import { Component } from '@angular/core';
import { Session } from '../../services/session';
import { Reason, rejectionReasons } from '../boost/rejection-reasons';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'minds-notification',
  inputs: ['_notification: notification'],
  templateUrl: 'notification.component.html',
})
export class NotificationComponent {
  notification: any;
  readonly cdnUrl: string;

  constructor(public session: Session, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
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

  findReason(code: number): Reason {
    return rejectionReasons.find((item: Reason) => {
      return item.code === code;
    });
  }
}
