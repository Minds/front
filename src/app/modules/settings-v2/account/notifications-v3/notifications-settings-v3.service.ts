import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, take, throttleTime } from 'rxjs/operators';
import { ApiResponse, ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import {
  EmailNotificationGetResponse,
  PushNotificationGetResponse,
  PushNotificationGroup,
} from './notifications-settings-v3.type';

/**
 * Service handling the changes of email and push notification settings.
 */
@Injectable({ providedIn: 'root' })
export class NotificationsSettingsV2Service {
  constructor(
    private api: ApiService,
    private toast: ToasterService
  ) {}

  /**
   * Gets push settings from server.
   * @returns { Observable<PushNotificationGetResponse> }
   */
  get pushSettings$(): Observable<PushNotificationGetResponse> {
    return this.api
      .get('api/v3/notifications/push/settings')
      .pipe(take(1), throttleTime(1000));
  }

  /**
   * Gets whether ALL push notifications are enabled.
   * @returns { Observable<boolean> } - true if all push notifications are enabled.
   */
  get pushNotificationsEnabled$(): Observable<boolean> {
    return this.pushSettings$.pipe(
      map((response: ApiResponse) => {
        if (response.status === 'success' && response.settings) {
          const allGroup = response.settings.filter((setting) => {
            return setting['notification_group'] === 'all';
          })[0];
          return allGroup.enabled;
        }
        throw new Error(
          response.message ??
            'An unknown error has occurred getting push notification settings'
        );
      })
    );
  }

  /**
   * Gets email settings from server.
   * @returns { Observable<EmailNotificationGetResponse> }
   */
  get emailSettings$(): Observable<EmailNotificationGetResponse> {
    return this.api.get('api/v2/settings/emails').pipe(
      take(1),
      catchError((e) => this.handleError(e)),
      throttleTime(1000)
    );
  }

  /**
   * Toggles push notification
   * @param { PushNotificationGroup } notificationGroup - group of notifications/
   * @param { boolean } enabled - whether to enable - defaults to true
   * @returns { Observable<ApiResponse> } - response.
   */
  public togglePush(
    notificationGroup: PushNotificationGroup,
    enabled: boolean = true
  ): Observable<ApiResponse> {
    return this.api
      .post(`api/v3/notifications/push/settings/${notificationGroup}`, {
        enabled: enabled,
      })
      .pipe(
        take(1),
        catchError((e) => this.handleError(e)),
        throttleTime(1000)
      );
  }

  /**
   * Toggles email notification
   * @param payload - payload to pass to server.
   * @returns { Observable<ApiResponse> } - response.
   */
  public toggleEmail(payload: any): Observable<ApiResponse> {
    return this.api.post('api/v2/settings/emails', payload).pipe(
      take(1),
      catchError((e) => this.handleError(e)),
      throttleTime(1000)
    );
  }

  /**
   * Handles error.
   * @param e error.
   * @returns { Observable<null> } returns EMPTY.
   */
  private handleError(e): Observable<null> {
    console.error(e);
    this.toast.error(e.message ?? 'An error occurred retrieving your settings');
    return EMPTY;
  }
}
