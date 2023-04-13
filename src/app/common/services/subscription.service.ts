import { RecentSubscriptionsService } from './recent-subscriptions.service';
import { Injectable } from '@angular/core';
import { Client } from '../api/client.service';
import { MindsGroup, MindsUser } from './../../interfaces/entities';
import { MindsGroupResponse } from '../../interfaces/responses';

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

  async subscribe(user: MindsUser | any): Promise<any> {
    if (user.type === 'group') {
      this.subscribeToGroup(user);
      return;
    }

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

  // Very hacky workaround for group subscriptions
  // To solve urgent onboarding needs
  async subscribeToGroup(group: MindsGroup): Promise<void> {
    await this.client.put(`api/v1/groups/membership/${group.guid}`);
  }
}
