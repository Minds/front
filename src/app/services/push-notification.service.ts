import { Subscription } from 'rxjs';
import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Client } from './api';
import { ConfigsService } from '../common/services/configs.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService implements OnInit, OnDestroy {
  private pushSubscription: PushSubscription;
  private onMessageSubscription: Subscription;

  constructor(
    private client: Client,
    private swPush: SwPush,
    private config: ConfigsService
  ) {}

  ngOnInit(): void {
    this.onMessageSubscription = this.swPush.messages.subscribe(this.onMessage);
  }

  ngOnDestroy(): void {
    this.onMessageSubscription?.unsubscribe();
  }

  private onMessage(message: any) {
    console.log('MESSAGE RECEIVED', message);
  }

  async subscribe() {
    if (!this.swPush.isEnabled) {
      console.log('Service worker unavailable');
      return null;
    }

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.config.get('vapid_key'),
      });
      // TODO: Send to server.
      this.pushSubscription = sub;
      this.registerToken(this.pushSubscription);
    } catch (err) {
      console.error('Could not subscribe due to:', err);
    }
  }

  registerToken(subscription: PushSubscription) {
    this.client.post('api/v3/notifications/push/token', {
      service: 'webpush',
      token: encodeURIComponent(btoa(JSON.stringify(subscription))),
    });
  }
}
