import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';
import { ChannelsV2Service } from '../channels-v2.service';
import { map } from 'rxjs/operators';

/**
 * Channel content states
 */
export type ChannelContentState =
  | 'pending'
  | 'not-found'
  | 'banned'
  | 'disabled'
  | 'blocked'
  | 'nsfw'
  | 'require-login';

/**
 * Exception content state triggers (used in channel container)
 */
export enum TRIGGER_EXCEPTION {
  NOT_FOUND = 'ChannelNotFoundException',
  DISABLED = 'ChannelDisabledException',
  BANNED = 'ChannelBannedException',
  REQUIRE_LOGIN = 'RequireLoginException',
}

/**
 * A container for channel loading errors.
 * (channel not found, channel banned ect).
 *
 * @author Ben Hayward
 */
@Injectable()
export class ChannelContentService {
  /**
   * Channel content state observable
   */
  readonly state$: Observable<ChannelContentState>;

  /**
   * Local NSFW toggle status
   */
  readonly forceNsfwContent$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Constructor. Build state observable.
   * @param service
   * @param session
   */
  constructor(
    public service: ChannelsV2Service,
    protected session: Session
  ) {
    // Derive state
    this.state$ = combineLatest([
      this.service.channel$,
      this.service.isBlocked$,
      this.session.user$,
      this.forceNsfwContent$,
    ]).pipe(
      map(([channel, isBlocked, currentUser, forceNsfwContent]) =>
        this.deriveState(channel, isBlocked, currentUser, forceNsfwContent)
      )
    );
  }

  /**
   * Derives the component state based on input channel
   * @param channel
   * @param isBlocked
   * @param currentUser
   * @param forceNsfwContent
   */
  public deriveState(
    channel: MindsUser,
    isBlocked: boolean,
    currentUser: MindsUser,
    forceNsfwContent: boolean
  ): ChannelContentState {
    if (!channel) {
      return 'pending';
    } else if (channel.not_found) {
      return 'not-found';
    } else if (channel.banned === 'yes') {
      return 'banned';
    } else if (channel.enabled === 'no') {
      return 'disabled';
    } else if (isBlocked) {
      return 'blocked';
    } else if (
      !forceNsfwContent &&
      !(currentUser && currentUser.mature) &&
      (!currentUser || currentUser.guid !== channel.guid) &&
      ((channel.nsfw && channel.nsfw.length > 0) || channel.is_mature)
    ) {
      return 'nsfw';
    } else if (channel.require_login) {
      return 'require-login';
    }

    return null;
  }
}
