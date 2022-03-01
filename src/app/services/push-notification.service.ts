import { Injectable } from '@angular/core';
import { OneSignal } from 'onesignal-ngx';
import { Client } from './api';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  /**
   * OneSignal Player ID
   */
  playerId: string;

  constructor(private client: Client, private oneSignal: OneSignal) {}

  async init() {
    await this.oneSignal.init({
      appId: '5f3f75cb-67d1-40f0-afce-f8412a9b46e1',
    });

    this.oneSignal.on('subscriptionChange', isSubscribed => {
      if (isSubscribed) {
        this.oneSignal.getUserId(userId => {
          if (userId) {
            console.log('PLAYER ID:', userId);
            this.playerId = userId;
            this.registerToken();
          }
        });
      }
    });

    this.oneSignal.isPushNotificationsEnabled(isEnabled => {
      if (isEnabled) {
        this.oneSignal.getUserId(userId => {
          if (userId) {
            console.log('PLAYER ID:', userId);
            this.playerId = userId;
            this.registerToken();
          }
        });
      }
    });
  }

  registerToken() {
    this.client.post('api/v3/notifications/push/token', {
      service: 'onesignal',
      token: this.playerId,
    });
  }
}
