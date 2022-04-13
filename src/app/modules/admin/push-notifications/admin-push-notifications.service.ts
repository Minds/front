import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NotificationDetails } from './admin-push-notifications.component';

@Injectable({
  providedIn: 'root',
})
export class AdminPushNotificationsService {
  private notifications = new Subject<NotificationDetails>();

  public sendNotification(notification: NotificationDetails): void {
    this.notifications.next(notification);
  }

  public getNotification(): Observable<NotificationDetails> {
    return this.notifications.asObservable();
  }
}
