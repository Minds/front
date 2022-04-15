import { Storage } from '../../services/storage';
import { MindsUser } from '../../interfaces/entities';
import { Injectable } from '@angular/core';

/**
 * how long should the subscriptions persist
 */
const RECENT_DURATION = 30 * 60 * 60 * 1000; // less than 30m

export interface RecentSubscription {
  /**
   * the channel id the user subscribed to
   */
  channelGuid: string;
  /**
   * timestamp of when this channel was subscribed to
   */
  subscribedAt: number;
}

/**
 * a service that remembers what the user has subscribed to in the last n minutes
 */
@Injectable({ providedIn: 'root' })
export class RecentSubscriptionsService {
  static readonly STORAGE_KEY = 'recent-subscriptions';
  private subscriptions: RecentSubscription[] = [];

  constructor(protected storage: Storage) {
    this._rehydrate();
  }

  /**
   * @param { MindsUser } channel
   * adds or removes a subscription to the list and preserves on disk
   */
  recordSubscriptionChange(channel: MindsUser): void {
    if (channel.subscribed) {
      this.subscriptions.unshift({
        channelGuid: channel.guid,
        subscribedAt: Date.now(),
      });
    } else {
      this.subscriptions = this.subscriptions.filter(
        p => p.channelGuid !== channel.guid
      );
    }

    this._persist();
  }

  /**
   * @returns { string[] } a list of subscription guids in the past n minutes
   */
  list(): string[] {
    const recentSubscriptions = this.subscriptions.filter(
      sub => Date.now() - sub.subscribedAt < RECENT_DURATION
    );
    if (this.subscriptions.length !== recentSubscriptions.length) {
      this.subscriptions = recentSubscriptions;
      this._persist();
    }
    return this.subscriptions.map(sub => sub.channelGuid);
  }

  /**
   * saves subscriptions to storage
   */
  private _persist(): void {
    this.storage.set(
      RecentSubscriptionsService.STORAGE_KEY,
      JSON.stringify(this.subscriptions)
    );
  }

  /**
   * loads subscriptions from storage if any
   */
  private _rehydrate(): void {
    const persistedData = this.storage.get(
      RecentSubscriptionsService.STORAGE_KEY
    );
    if (persistedData) {
      try {
        this.subscriptions = JSON.parse(persistedData);
      } catch (e) {
        console.error('Something went wrong while rehydrating data', e);
      }
    }
  }
}
