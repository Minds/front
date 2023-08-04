import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MindsGroup } from './group.model';
import { GroupsService } from '../groups.service';
import { DEFAULT_GROUP_VIEW, GroupAccessType, GroupView } from './group.types';

/**
 * Service that holds group information using Observables
 */
@Injectable()
export class GroupService {
  private baseEndpoint: string = 'api/v1/groups/';

  /**
   * Group GUID
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The group
   */
  readonly group$: BehaviorSubject<MindsGroup> = new BehaviorSubject<
    MindsGroup
  >(null);

  /**
   * Whether to show the Requests tab
   */
  readonly showRequestsTab$: Observable<boolean>;

  /**
   * Whether to show the Review tab
   */
  readonly showReviewTab$: Observable<boolean>;

  /**
   * Whether user has access to group contents (feed, members list, etc.)
   */
  readonly userHasAccess$: Observable<boolean>;

  /**
   * Admin status
   */
  // readonly isAdmin$: Observable<boolean>;

  /**
   * Member count
   */
  readonly memberCount$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  /**
   * Count of pending requests users have made to join the group
   */
  readonly requestCount$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  /**
   * Count of posts that are awaiting mod review and approval
   */
  readonly reviewCount$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  /**
   * Whether group is private
   */
  readonly private$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether group is moderated
   */
  readonly moderated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user is the group owner
   */
  readonly isOwner$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user is the group creator
   */
  readonly isCreator$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user is a group member
   */
  readonly isMember$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user is a group moderator
   */
  readonly isModerator$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * Whether current user is awaiting approval to join the group
   */
  readonly isAwaiting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user has muted notifications for this group
   */
  readonly isMuted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Search query
   */
  readonly query$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  /**
   * Loading in progress
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * The active view that is visible on the group page
   */
  readonly view$: BehaviorSubject<GroupView> = new BehaviorSubject<GroupView>(
    DEFAULT_GROUP_VIEW
  );

  /**
   * Constructor
   * @param api
   * @param session
   * @param route
   * @param v1Service
   */
  constructor(
    protected api: ApiService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected v1Service: GroupsService
  ) {
    // ojm no need for tab
    // Set showRequestsTab observable
    this.showRequestsTab$ = combineLatest([
      this.isOwner$,
      this.isModerator$,
      this.requestCount$,
    ]).pipe(
      map(
        ([isOwner, isModerator, requestCount]) =>
          (isOwner || isModerator) && requestCount > 0
      )
    );
    // Set showReviewTab observable
    this.showReviewTab$ = combineLatest([
      this.isOwner$,
      this.isModerator$,
      this.reviewCount$,
    ]).pipe(
      map(
        ([isOwner, isModerator, reviewCount]) =>
          (isOwner || isModerator) && reviewCount > 0
      )
    );
    // Set userHasAccess observable
    this.userHasAccess$ = combineLatest([this.private$, this.isMember$]).pipe(
      map(([isPrivate, isMember]) => !isPrivate || (isPrivate && isMember))
    );
  }

  /**
   * Loads a new group
   * @param group the group or its guid
   */
  load(group: MindsGroup | string): void {
    console.log('ojm SVC load()', group);

    if (typeof group === 'object') {
      this.guid$.next(group.guid);
      this.setGroup(group);
      this.syncLegacyService(group);
    } else {
      this.guid$.next(group);
      this.sync();
    }
  }

  /**
   * Re-sync current group from server
   */
  sync(): void {
    const guid = this.guid$.getValue();
    this.inProgress$.next(true);

    this.api.get(`${this.baseEndpoint}group/${guid}`).subscribe(response => {
      this.setGroup(response.group);
      this.syncLegacyService(response.group);
    });
  }

  /**
   * Sets the state based on a group
   */
  setGroup(group: MindsGroup | null): void {
    console.log('ojm setGroup', group);
    this.group$.next(group ? group : null);
    this.moderated$.next(group ? !!group.moderated : false);
    this.private$.next(
      group && group.membership === GroupAccessType.PRIVATE ? true : false
    );
    this.memberCount$.next(group ? group['members:count'] : 0);
    this.requestCount$.next(group ? group['requests:count'] : 0);
    this.reviewCount$.next(group ? group['adminqueue:count'] : 0);

    this.isOwner$.next(group ? group['is:owner'] : false);
    this.isCreator$.next(group ? group['is:creator'] : false);
    this.isMember$.next(group ? group['is:member'] : false);
    this.isModerator$.next(group ? group['is:creator'] : false);
    this.isAwaiting$.next(group ? group['is:creator'] : false);
    this.isMuted$.next(group ? group['is:creator'] : false);
  }

  /**
   * Sync group for legacy components that are using GroupsService
   */
  public syncLegacyService(group: MindsGroup): void {
    this.v1Service.load(group);
  }
}
