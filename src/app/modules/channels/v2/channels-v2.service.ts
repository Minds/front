import { Injectable } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';

/**
 * Service that holds a channel information using Observables
 */
@Injectable()
export class ChannelsV2Service {
  /**
   * Channel GUID
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Channel data
   */
  readonly channel$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  /**
   * Constructor
   * @param api
   */
  constructor(protected api: ApiService) {}

  /**
   * Loads a new channel
   * @param channel
   */
  load(channel: MindsUser | string) {
    const guid: string = typeof channel === 'object' ? channel.guid : channel;

    this.guid$.next(guid);

    if (typeof channel === 'object') {
      this.channel$.next(channel);
    }

    this.sync();
  }

  /**
   * Re-sync current channel from server
   */
  sync() {
    this.api
      .get(`api/v1/channel/${this.guid$.getValue()}`)
      .subscribe(response => {
        this.channel$.next(response.channel);
      });
  }
}
