import { Injectable } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import {
  distinctUntilChanged,
  map,
  switchAll,
  switchMap,
} from 'rxjs/operators';

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
   * Tokens the channel received in the last period
   */
  readonly tokens$: Observable<number>;

  /**
   * Tokens the current user sent to the channel
   */
  readonly tokensSent$: Observable<number>;

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
   * Admin status
   */
  readonly isAdmin$: Observable<boolean>;

  /**
   * Amount of public groups the user is member of
   */
  readonly groupCount$: Observable<number>;

  /**
   * Constructor
   * @param api
   * @param session
   */
  constructor(protected api: ApiService, protected session: Session) {
    // Set tokens$ observable
    this.tokens$ = this.channel$.pipe(
      distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
      map(
        channel =>
          channel &&
          this.api.get(`api/v1/wire/sums/overview/${channel.guid}`, {
            merchant: channel.merchant ? 1 : 0,
          })
      ),
      switchAll(),
      map(response => parseFloat((response && response.tokens) || '0'))
    );

    // Set tokensSent$ observable
    this.tokensSent$ = this.channel$.pipe(
      distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
      map(
        channel =>
          channel && this.api.get(`api/v1/wire/rewards/${channel.guid}`)
      ),
      switchAll(),
      map(response =>
        parseFloat((response && response.sums && response.sums.tokens) || '0')
      )
    );

    // Set groupCount$ observable
    // this.groupCount$ = this.channel$.pipe(
    //   distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
    //   map(
    //     channel =>
    //       channel && this.api.get(`api/v2/channel/groups/${channel.guid}/count`)
    //   ),
    //   switchAll(),
    //   map(response =>
    //     (response && response.count) || 0
    //   )
    // );
    this.groupCount$ = of(0);

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

    // Set isAdmin$ observable
    this.isAdmin$ = this.channel$.pipe(
      map(channel => channel && channel.is_admin)
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
