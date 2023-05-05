import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import {
  catchError,
  distinctUntilChanged,
  map,
  shareReplay,
  switchAll,
  tap,
} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { MindsGroup } from './group.model';
import { GroupsService } from '../groups.service';
import {
  DEFAULT_GROUP_FEED_FILTER,
  DEFAULT_GROUP_VIEW,
  GroupFeedFilter,
  GroupView,
} from './group.types';

/**
 * Service that holds group information using Observables
 */
@Injectable()
export class GroupService {
  /**
   * Group GUID
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Whether to show the Requests tab
   */
  readonly showRequestsTab$: Observable<boolean>;

  /**
   * Whether to show the Review tab
   */
  readonly showReviewTab$: Observable<boolean>;

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
   * The activity type filter applied to the feed
   */
  readonly filter$: BehaviorSubject<GroupFeedFilter> = new BehaviorSubject<
    GroupFeedFilter
  >(DEFAULT_GROUP_FEED_FILTER);

  /**
   * Whether a user is editing the channel profile
   *
   * Editing occurs in v1 groups profile page
   */
  readonly editing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Constructor
   * @param api
   * @param session
   */
  constructor(
    protected api: ApiService,
    protected session: Session,
    protected route: ActivatedRoute,
    protected v1Service: GroupsService
  ) {
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
  }

  /**
   * Performs the API response. Depends on guid$ value
   */
  apiResponse$: Observable<any> = this.guid$.pipe(
    distinctUntilChanged(),
    tap(guid => {
      // Initialize group for legacy components that are using GroupsService
      this.v1Service.load(guid);
      this.inProgress$.next(true);
    }),
    map(guid => {
      return this.api.get(`api/v1/groups/group/${guid}`).pipe(
        catchError(e => {
          return EMPTY;
        })
      );
    }),
    switchAll(),
    shareReplay({ bufferSize: 1, refCount: true }),
    tap(() => {
      this.inProgress$.next(false);
    })
  );

  /**
   * The group that gets reurned in the apiResponse$
   */
  group$: Observable<MindsGroup> = this.apiResponse$.pipe(
    distinctUntilChanged(),
    map(apiResponse => {
      const group = apiResponse?.group || null;

      this.moderated$.next(group ? !!group.moderated : false);
      this.memberCount$.next(group ? group['members:count'] : 0);
      this.requestCount$.next(group ? group['requests:count'] : 0);
      this.reviewCount$.next(group ? group['adminqueue:count'] : 0);

      this.isOwner$.next(group ? group['is:owner'] : false);
      this.isCreator$.next(group ? group['is:creator'] : false);
      this.isMember$.next(group ? group['is:member'] : false);
      this.isModerator$.next(group ? group['is:creator'] : false);
      this.isAwaiting$.next(group ? group['is:creator'] : false);
      this.isMuted$.next(group ? group['is:creator'] : false);

      return group;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
