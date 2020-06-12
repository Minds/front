import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GroupV2Service } from '../../services/group-v2.service';
import { Session } from '../../../../../services/session';
import { MindsUser } from '../../../../../interfaces/entities';

/**
 * Group content states
 */
export type GroupContentState =
  | 'loading'
  | 'request-pending'
  | 'not-found'
  | 'not-a-member'
  | 'deleted'
  | 'nsfw';

/**
 * Exception content state triggers (used in group container)
 */
export enum TRIGGER_EXCEPTION {
  NOT_FOUND = 'GroupNotFoundException',
  DISABLED = 'GroupDisabledException',
  BANNED = 'GroupBannedException',
}

/**
 * A container for group loading errors.
 * (group not found, group banned ect).
 *
 * @author Ben Hayward
 */
@Injectable()
export class GroupContentService {
  /**
   * Group content state observable
   */
  readonly state$: Observable<GroupContentState>;

  /**
   * Local NSFW toggle status
   */
  readonly forceNsfwContent$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Constructor. Build state observable.
   * @param service
   * @param session
   */
  constructor(public service: GroupV2Service, protected session: Session) {
    // Derive state
    this.state$ = combineLatest([
      this.service.group$,
      this.service.isMember$,
      this.session.user$,
      this.forceNsfwContent$,
    ]).pipe(
      map(([group, isMember, currentUser, forceNsfwContent]) =>
        this.deriveState(group, isMember, currentUser, forceNsfwContent)
      )
    );
  }

  /**
   * Derives the component state based on input group
   * @param group
   * @param isMember
   * @param currentUser
   * @param forceNsfwContent
   */
  public deriveState(
    group: any,
    isMember: boolean,
    currentUser: MindsUser,
    forceNsfwContent: boolean
  ): GroupContentState {
    if (!group) {
      return 'loading';
    } else if (group['is:awaiting']) {
      return 'request-pending';
    } else if (group.not_found) {
      return 'not-found';
    } else if (group.deleted) {
      return 'deleted';
    } else if (!isMember) {
      return 'not-a-member';
    } else if (
      !forceNsfwContent &&
      !(currentUser && currentUser.mature) &&
      (!currentUser || currentUser.guid !== group.guid) &&
      ((group.nsfw && group.nsfw.length > 0) || group.is_mature)
    ) {
      return 'nsfw';
    }
    return null;
  }
}
