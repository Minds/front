import { Component, Input } from '@angular/core';
import { NotificationDetails } from '../../admin-push-notifications.component';

@Component({
  selector: 'm-notificationHistoryCard',
  styleUrls: ['notification-history-card.component.ng.scss'],
  templateUrl: 'notification-history-card.component.html',
  standalone: false,
})
export class NotificationHistoryCardComponent {
  @Input()
  public notification: NotificationDetails = null;
}
