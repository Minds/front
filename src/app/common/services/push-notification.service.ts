import { isPlatformServer } from '@angular/common';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { ConfigsService } from './configs.service';
import { Client } from '../../services/api';
import { Session } from '../../services/session';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private pushSubscription$: BehaviorSubject<
    PushSubscription
  > = new BehaviorSubject(undefined);

  constructor(
    private client: Client,
    private swPush: SwPush,
    private config: ConfigsService,
    private session: Session,
    @Inject(PLATFORM_ID) private platformId
  ) {
    if (isPlatformServer(platformId)) return;

    this.subscriptions.push(
      this.swPush.messages.subscribe(this.onMessage),
      this.session.userEmitter.subscribe(user => this.onUserChange(user)),
      this.swPush.subscription.subscribe(pushSubscription =>
        this.pushSubscription$.next(pushSubscription)
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.map(subscription => subscription.unsubscribe());
  }

  /**
   * does the browser support push notifications?
   * @returns { Observable<boolean> }
   */
  get supported$(): Observable<boolean> {
    return of(this.swPush.isEnabled);
  }

  /**
   * has the user provided access to push notifs?
   * @returns { Observable<boolean> }
   */
  get enabled$(): Observable<boolean> {
    return this.pushSubscription$.pipe(map(sub => Boolean(sub)));
  }

  /**
   * Subscribes to Web Push Notifications, after requesting and receiving user permission
   * @returns { Promise<void> }
   */
  async requestSubscription(): Promise<void> {
    if (!this.swPush.isEnabled) {
      console.log('[PushNotificationService] Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('[PushNotificationService] User not logged in');
      return null;
    }

    return runWithTimeout(async () => {
      const pushSubscription = await this.swPush.requestSubscription({
        serverPublicKey: this.config.get('vapid_key'),
      });
      await this.registerToken(pushSubscription);
    }, 5000);
  }

  /**
   * user wants to disable push notifs
   * @returns { Promise<void> }
   */
  async cancelSubscription(): Promise<void> {
    return this.swPush?.unsubscribe();
  }

  /**
   * unregisters push token from server
   * @returns { Promise<unknown> }
   */
  async unregisterToken(): Promise<unknown> {
    if (!this.swPush.isEnabled) {
      console.log('[PushNotificationService] Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('[PushNotificationService] User not logged in');
      return null;
    }

    if (!this.pushSubscription$.getValue()) {
      console.log('[PushNotificationService] no subscription');
      return null;
    }

    const token = encodeURIComponent(
      btoa(JSON.stringify(this.pushSubscription$.getValue()))
    );
    return this.client.delete(`api/v3/notifications/push/token/${token}`);
  }

  /**
   * called when user changes
   * @param user
   * @returns { void }
   */
  private onUserChange(user: any): void {
    if (user) {
      this.registerToken(this.pushSubscription$.getValue());
    }
  }

  /**
   * called when a new push message is received
   * @param message
   * @returns { void }
   */
  private onMessage(message: any): void {
    console.log('[PushNotificationService] message received', message);
  }

  /**
   * registers push token to server
   * @returns { Promise<unknown> }
   */
  private registerToken(pushSubscription: PushSubscription): Promise<unknown> {
    if (!this.swPush.isEnabled) {
      console.log('[PushNotificationService] Service worker unavailable');
      return null;
    }

    if (!this.session.getLoggedInUser()) {
      console.log('[PushNotificationService] User not logged in');
      return null;
    }

    if (!pushSubscription) {
      console.log('[PushNotificationService] no subscription');
      return null;
    }

    return this.client.post('api/v3/notifications/push/token', {
      service: 'webpush',
      token: encodeURIComponent(btoa(JSON.stringify(pushSubscription))),
    });
  }
}

/**
 * runs a promise and fails after a timeout
 * @param fn a function to run
 * @param timeout in ms
 * @returns
 */
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
