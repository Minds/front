import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ConfigsService } from '../common/services/configs.service';
import { Client } from './api';
import { Session } from './session';
import { map } from 'rxjs/operators';

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
  async requestSubscription() {
    if (!this.swPush.isEnabled) {
      console.log('Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('User not logged in');
      return null;
    }

    try {
      return this.swPush.requestSubscription({
        serverPublicKey: this.config.get('vapid_key'),
      });
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
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
      this.registerToken();
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
  private registerToken() {
    if (!this.swPush.isEnabled) {
      console.log('Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('User not logged in');
      return null;
    }

    if (!this.pushSubscription$.getValue()) return;

    return this.client.post('api/v3/notifications/push/token', {
      service: 'webpush',
      token: encodeURIComponent(
        btoa(JSON.stringify(this.pushSubscription$.getValue()))
      ),
    });
  }
}
