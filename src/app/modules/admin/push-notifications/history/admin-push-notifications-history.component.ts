import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationDetails } from '../admin-push-notifications.component';
import { Subscription } from 'rxjs';
import { AdminPushNotificationsService } from '../admin-push-notifications.service';
import { Client } from '../../../../services/api/client';
import { ApiResponse } from '../../../../common/api/api.service';

@Component({
  selector: 'm-admin__pushNotifications--history',
  styleUrls: ['admin-push-notifications-history.component.ng.scss'],
  templateUrl: './admin-push-notifications-history.component.html',
})
export class AdminPushNotificationsHistoryComponent
  implements OnInit, OnDestroy
{
  public notifications: Array<NotificationDetails> = [];
  private notifications$: Subscription;

  constructor(
    private apiClient: Client,
    private adminPushNotificationsService: AdminPushNotificationsService
  ) {
    this.notifications$ = this.adminPushNotificationsService
      .getNotification()
      .subscribe((notification) => {
        this.notifications.unshift(notification);
        this.notifications.splice(12);
      });
  }

  ngOnDestroy(): void {
    this.notifications$.unsubscribe();
  }

  ngOnInit(): void {
    /**
     * Retrieve existing history from API and populate notifications array.
     */
    this.apiClient
      .get('api/v3/notifications/push/system')
      .then((response: ApiResponse) => {
        if (response.notifications.length) {
          this.notifications =
            response.notifications as Array<NotificationDetails>;
        }
      })
      .catch((e) => {});
  }
}
