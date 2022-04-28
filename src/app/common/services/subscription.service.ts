import { RecentSubscriptionsService } from './recent-subscriptions.service';
import { Injectable } from '@angular/core';
import { Client } from '../api/client.service';
import { MindsUser } from './../../interfaces/entities';

/**
 * used to subscribe/unsubscribe to and from different channels
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionService {
  constructor(
    private client: Client,
    private recentSubscriptions: RecentSubscriptionsService
  ) {}

  async isSubscribed(user: MindsUser): Promise<boolean> {
    return this.client
      .get(`api/v1/channel/${user.guid}`)
      .then((response: any) => response?.channel?.subscribed);
  }

  async subscribe(user: MindsUser): Promise<any> {
    const response: any = await this.client.post(
      `api/v1/subscribe/${user.guid}`
    );
    if (response?.error) {
      throw 'error';
    }

    this.recentSubscriptions.recordSubscriptionChange({
      ...user,
      subscribed: true,
    });
    return response;
  }

  async unsubscribe(user: MindsUser): Promise<any> {
    const response: any = await this.client.delete(
      `api/v1/subscribe/${user.guid}`
    );
    if (response?.error) {
      throw 'error';
    }
    this.recentSubscriptions.recordSubscriptionChange({
      ...user,
      subscribed: false,
    });
    return response;
  }
}
