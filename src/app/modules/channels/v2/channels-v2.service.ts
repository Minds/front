import { Injectable, EventEmitter } from '@angular/core';
import { MindsUser } from '../../../interfaces/entities';
import {
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  Observable,
  of,
} from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchAll,
  take,
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
  readonly channel$: BehaviorSubject<MindsUser> =
    new BehaviorSubject<MindsUser>(null);

  /**
   * The user's email
   */
  readonly email$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Nsfw reasons
   */
  readonly nsfw$: BehaviorSubject<Array<number>> = new BehaviorSubject<
    Array<number>
  >([]);

  /**
   * Boost rating
   */
  readonly rating$: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  /**
   * Seed status
   */
  readonly seed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  /**
   * Search query
   */
  readonly query$: BehaviorSubject<string> = new BehaviorSubject<string>('');

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
   * Can interact with channel?
   */
  readonly canInteract$: Observable<boolean>;

  /**
   * Banned status
   */
  readonly isBanned$: Observable<boolean>;

  /**
   * Explicit status
   */
  readonly isExplicit$: Observable<boolean>;

  /**
   * Disabled status
   */
  readonly isDisabled$: Observable<boolean>;

  /**
   * Admin status
   */
  readonly isAdmin$: Observable<boolean>;

  /**
   * Amount of public groups the user is member of
   */
  readonly groupCount$: Observable<number>;

  /**
   * called when user subscribes to this channel
   */
  readonly onSubscriptionChanged = new EventEmitter<boolean>();

  /**
   * Constructor
   * @param api
   * @param session
   */
  constructor(
    protected api: ApiService,
    protected session: Session,
    protected route: ActivatedRoute
  ) {
    // Set tokens$ observable
    this.tokens$ = this.channel$.pipe(
      distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
      map((channel) =>
        channel
          ? this.api.get(`api/v1/wire/sums/overview/${channel.guid}`, {
              merchant: channel.merchant ? 1 : 0,
            })
          : of(null)
      ),
      switchAll(),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
      map((response) => parseFloat((response && response.tokens) || '0'))
    );

    // Set tokensSent$ observable
    this.tokensSent$ = this.channel$.pipe(
      distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
      map((channel) =>
        channel ? this.api.get(`api/v1/wire/rewards/${channel.guid}`) : of(null)
      ),
      switchAll(),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
      map((response) =>
        parseFloat((response && response.sums && response.sums.tokens) || '0')
      )
    );

    // Set groupCount$ observable
    this.groupCount$ = this.channel$.pipe(
      distinctUntilChanged((a, b) => !a || !b || a.guid === b.guid),
      map((channel) =>
        channel
          ? this.api.get(`api/v3/channel/${channel.guid}/groups/count`)
          : of(null)
      ),
      switchAll(),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
      map((response) => (response && response.count) || 0)
    );

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

    // Set isBlocked$ observable (blocked or banned)
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

    // Set canInteract$ observable
    this.canInteract$ = combineLatest([this.channel$, this.isBlocked$]).pipe(
      map(
        ([channel, isBlocked]) =>
          !isBlocked && channel && channel.guid && channel.banned !== 'yes'
      )
    );

    // Set isBanned$ observable
    this.isBanned$ = combineLatest([
      this.isOwner$,
      this.session.user$,
      this.channel$,
    ]).pipe(
      map(
        ([isOwner, currentUser, channel]) =>
          !isOwner && currentUser && channel && channel.banned === 'yes'
      )
    );

    // Set isExplicit$ observable
    this.isExplicit$ = combineLatest([
      this.isOwner$,
      this.session.user$,
      this.channel$,
    ]).pipe(
      map(
        ([isOwner, currentUser, channel]) =>
          !isOwner && currentUser && channel && channel.is_mature
      )
    );

    // Set isAdmin$ observable
    this.isAdmin$ = this.session.user$.pipe(
      map((channel) => channel && channel.is_admin)
    );

    // set isDisabled$ observable
    this.isDisabled$ = this.channel$.pipe(
      map((channel) => channel && channel.enabled === 'no')
    );
  }

  /**
   * Loads a new channel
   * @param channel
   */
  load(channel: MindsUser | string): void {
    const params = this.route.snapshot.queryParamMap;
    let query = '';
    if (params.has('query')) {
      query = decodeURIComponent(params.get('query'));
    }

    this.query$.next(query);

    this.guid$.next(typeof channel === 'object' ? channel.guid : channel);
    this.setChannel(typeof channel === 'object' ? channel : null);

    // this.sync();
  }

  /**
   * Re-sync current channel from server
   */
  sync(): void {
    this.api
      .get(`api/v1/channel/${this.guid$.getValue()}`)
      .subscribe((response) => {
        this.setChannel(response.channel);
      });
  }

  /**
   * Sets the state based on a channel
   */
  setChannel(channel: MindsUser | null): ChannelsV2Service {
    this.channel$.next(channel);
    this.username$.next(channel ? channel.username : '');
    this.email$.next(channel ? channel.email : null);
    this.nsfw$.next(channel ? channel.nsfw : []);
    this.rating$.next(channel ? channel.rating : 1);
    this.seed$.next(channel ? channel.seed : null);
    return this;
  }

  /**
   * Get a channel by identifier.
   * @param { string } identifier - channel identifier (username or guid).
   * @returns { Promise<MindsUser> } user, or null if none found or an error in encountered.
   */
  public async getChannelByIdentifier(identifier: string): Promise<MindsUser> {
    return lastValueFrom(
      this.api.get(`api/v1/channel/${identifier}`).pipe(
        take(1),
        map((response) => response?.channel),
        catchError((e: unknown): Observable<null> => {
          console.error(e);
          return of(null);
        })
      )
    );
  }
}
