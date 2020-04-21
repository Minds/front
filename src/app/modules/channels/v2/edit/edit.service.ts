import { Injectable } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ChannelEditService {
  /**
   * Channel to be edited
   */
  readonly channel$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  /**
   * Sets the channel
   * @param channel
   */
  setChannel(channel: MindsUser): ChannelEditService {
    // TODO: Reset state if different
    this.channel$.next(channel);
    return this;
  }
}
