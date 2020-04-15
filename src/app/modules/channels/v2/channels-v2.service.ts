import { Injectable } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { map } from 'rxjs/operators';

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
   * Channel username
   */
  readonly username$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Channel data
   */
  readonly channel$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  /**
   * Flag that checks if the current user is the channel owner
   */
  readonly isOwner$: Observable<boolean>;

  /**
   * Subscription status
   */
  readonly isSubscribed$: Observable<boolean>;

  /**
   * Blocked status
   */
  readonly isBlocked$: Observable<boolean>;

  /**
   * Constructor
   * @param api
   * @param session
   */
  constructor(protected api: ApiService, protected session: Session) {
    // Set isOwner$ observable
    this.isOwner$ = combineLatest([this.guid$, this.session.user$]).pipe(
      map(
        ([guid, currentUser]) =>
          guid && currentUser && guid === currentUser.guid
      )
    );

    // Set isSubscribed$ observable
    this.isSubscribed$ = combineLatest([
      this.isOwner$,
      this.session.user$,
      this.channel$,
    ]).pipe(
      map(
        ([isOwner, currentUser, channel]) =>
          !isOwner && currentUser && channel && channel.subscribed
      )
    );

    // Set isBlocked$ observable
    this.isBlocked$ = combineLatest([
      this.isOwner$,
      this.session.user$,
      this.channel$,
    ]).pipe(
      map(
        ([isOwner, currentUser, channel]) =>
          !isOwner && currentUser && channel && channel.blocked
      )
    );
  }

  /**
   * Loads a new channel
   * @param channel
   */
  load(channel: MindsUser | string): void {
    this.guid$.next(typeof channel === 'object' ? channel.guid : channel);
    this.setChannel(typeof channel === 'object' ? channel : null);

    this.sync();
  }

  /**
   * Re-sync current channel from server
   */
  sync(): void {
    this.api
      .get(`api/v1/channel/${this.guid$.getValue()}`)
      .subscribe(response => {
        this.setChannel(response.channel);
      });
  }

  /**
   * Sets the state based on a channel
   */
  setChannel(channel: MindsUser | null): ChannelsV2Service {
    this.channel$.next(channel);
    this.username$.next(channel ? channel.username : '');
    return this;
  }
}
