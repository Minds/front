import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ConfigsService } from '../common/services/configs.service';
import { Client } from './api';
import { Session } from './session';
import { map } from 'rxjs/operators';

const runWithTimeout = (fn: () => Promise<any>, timeout: number) => {
  return Promise.race([
    fn(),
    new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, timeout);
    }),
  ]);
};

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private pushSubscription$: BehaviorSubject<
    PushSubscription
  > = new BehaviorSubject(undefined);

  constructor(
    private client: Client,
    private swPush: SwPush,
    private config: ConfigsService,
    private session: Session
  ) {
    this.swPush.messages.subscribe(this.onMessage);
    this.session.userEmitter.subscribe(user => this.onUserChange(user));
    this.swPush.subscription.subscribe(pushSubscription =>
      this.pushSubscription$.next(pushSubscription)
    );
  }

  get supportsPushNotifications() {
    return this.swPush.isEnabled;
  }

  /**
   * has the user provided access to push notifs?
   */
  get enabled$() {
    return this.pushSubscription$.pipe(map(sub => Boolean(sub)));
  }

  /**
   * Subscribes to Web Push Notifications, after requesting and receiving user permission
   * @returns { Promise<void> }
   */
  requestSubscription() {
    return runWithTimeout(async () => {
      debugger;
      if (!this.swPush.isEnabled) {
        console.log('Service worker unavailable');
        return null;
      }

      if (!this.session.getLoggedInUser()) {
        console.log('User not logged in');
        return null;
      }

      const pushSubscription = await this.swPush.requestSubscription({
        serverPublicKey: this.config.get('vapid_key'),
      });
      return this.registerToken(pushSubscription);
    }, 5000);
  }

  /**
   * user wants to disable push notifs
   * @returns { Promise<boolean> }
   */
  async cancelSubscription() {
    return this.swPush?.unsubscribe();
  }

  /**
   * unregisters push token from server
   * @returns { Promise<unknown> }
   */
  async unregisterToken() {
    if (!this.swPush.isEnabled) {
      console.log('Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('User not logged in');
      return null;
    }

    if (!this.pushSubscription$.getValue()) return;

    const token = encodeURIComponent(
      btoa(JSON.stringify(this.pushSubscription$.getValue()))
    );
    return this.client.delete(`api/v3/notifications/push/token/${token}`);
  }

  /**
   * called when user changes
   * @param user
   */
  private onUserChange(user: any) {
    if (user) {
      this.registerToken(this.pushSubscription$.getValue());
    }
  }

  /**
   * called when a new push message is received
   * @param message
   */
  private onMessage(message: any) {
    console.log('MESSAGE RECEIVED', message);
  }

  /**
   * registers push token to server
   * @returns { Promise<unknown> }
   */
  private registerToken(pushSubscription: PushSubscription) {
    if (!this.swPush.isEnabled) {
      console.log('Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('User not logged in');
      return null;
    }

    if (!pushSubscription) return;

    return this.client.post('api/v3/notifications/push/token', {
      service: 'webpush',
      token: encodeURIComponent(btoa(JSON.stringify(pushSubscription))),
    });
  }
}
