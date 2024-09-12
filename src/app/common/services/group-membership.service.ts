import { Injectable, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  combineLatest,
  map,
  of,
  switchMap,
  take,
  tap,
  throttleTime,
} from 'rxjs';
import { ToasterService } from './toaster.service';
import { MindsGroup } from '../../modules/groups/v2/group.model';
import { ApiService } from '../api/api.service';
import { GroupAccessType } from '../../modules/groups/v2/group.types';
import { Router } from '@angular/router';

export type GroupMembershipResponse = {
  done: boolean;
  status: string;
  message?: string;
};

/** Options for group join requests. */
export type GroupJoinOptions = {
  targetUserGuid?: string; // guid of the user to be added to the group (used when group moderator accepts a request to join a closed group)
  navigateOnSuccess?: boolean; // whether group should be navigated to on success.
};

/**
 * Service that handles group membership changes
 * (a.k.a. join, leave, accept/decline invitation, cancel request)
 */
@Injectable()
export class GroupMembershipService implements OnDestroy {
  private base: string = 'api/v1/groups/';

  public readonly group$: BehaviorSubject<MindsGroup> =
    new BehaviorSubject<MindsGroup>(null);

  public readonly groupGuid$: Observable<string> = this.group$.pipe(
    take(1),
    map((group) => group?.guid)
  );

  public readonly isPublic$: Observable<boolean> = this.group$.pipe(
    take(1),
    map((group: MindsGroup) => {
      return group.membership === GroupAccessType.PUBLIC;
    })
  );

  /**
   * Whether the current user is a member of the group
   */
  public readonly isMember$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether the current user is the owner of the group
   */
  public readonly isOwner$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether the current user is the creator of the group
   */
  public readonly isCreator$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether the current user is waiting to hear whether their request to join a closed group was accepteed
   */
  public readonly isAwaiting$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether the current user was invited to join a group
   * and hasn't yet made a decision to accept/decline
   */
  public readonly isInvited$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether the current user is banned from the group
   */
  public readonly isBanned$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether we are currently processing a change in membership
   */
  public readonly inProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription[] = [];

  constructor(
    private api: ApiService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  setGroup(group: MindsGroup) {
    this.group$.next(group);
    this.isMember$.next(group['is:member']);
    this.isAwaiting$.next(group['is:awaiting']);
    this.isInvited$.next(group['is:invited']);
    this.isBanned$.next(group['is:banned']);
    this.isOwner$.next(group['is:owner']);
    this.isCreator$.next(group['is:creator']);
  }

  /**
   * Join the group
   * @param { GroupJoinOptions } groupJoinOptions - options.
   * @returns { void }
   */
  public join(groupJoinOptions: GroupJoinOptions = {}): void {
    this.inProgress$.next(true);

    const joinResponse$ = this.groupGuid$.pipe(
      take(1), // call once
      throttleTime(2000), // disallow more than 1 request every 2s
      switchMap((groupGuid: string): Observable<GroupMembershipResponse> => {
        // switch outer observable to api req.
        let endpoint = `${this.base}membership/${groupGuid}`;

        if (groupJoinOptions?.targetUserGuid) {
          endpoint += `/${groupJoinOptions.targetUserGuid}`;
        }

        return this.api.put(endpoint);
      }),
      tap((response: GroupMembershipResponse): void => {
        if (!response.done) {
          throw new Error(response?.message ?? 'An unknown error has occurred');
        }
      }),
      catchError((e) => {
        this.inProgress$.next(false);
        this.handleRequestError(e, true);
        return of(null);
      })
    );

    this.subscriptions.push(
      combineLatest([joinResponse$, this.isPublic$, this.groupGuid$])
        .pipe(
          map(([response, isPublic, groupGuid]) => {
            this.inProgress$.next(false);

            if (response && response.status === 'success') {
              if (isPublic) {
                this.isMember$.next(true);
              } else if (response['invite_accepted']) {
                this.isAwaiting$.next(false);
                this.isMember$.next(true);
              } else {
                this.isAwaiting$.next(true);
                this.toaster.success(
                  'Your request to join this group has been sent.'
                );
              }

              // only navigate if requested, and the user is not already on the page.
              if (
                groupJoinOptions?.navigateOnSuccess &&
                !this.router.url.includes(`/group/${groupGuid}`)
              ) {
                this.router.navigateByUrl(`/group/${groupGuid}`);
              }
              return;
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Leave the group
   *
   * @param targetUserGuid guid of the user to be removed from the group (used when group moderator rejects a request to join a closed group)
   * @returns { void }
   */
  public leave(targetUserGuid: string = null): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.groupGuid$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap(
            (groupGuid: string): Observable<GroupMembershipResponse> => {
              // switch outer observable to api req.
              let endpoint = `${this.base}membership/${groupGuid}`;

              if (targetUserGuid) {
                endpoint += `/${targetUserGuid}`;
              }

              return this.api.delete(endpoint);
            }
          ),
          tap((response: GroupMembershipResponse): void => {
            if (!response.done) {
              throw new Error(
                response?.message ?? 'An unknown error has occurred'
              );
            }
          }),
          catchError((e) => {
            this.handleRequestError(e, true);
            return of(null);
          })
        )
        .subscribe((response) => {
          this.inProgress$.next(false);
          if (response && response.status === 'success') {
            this.isMember$.next(false);
            return;
          }
        })
    );
  }

  /**
   * Accept an invitation to join the group
   *
   * @returns { void }
   */
  public acceptInvitation(): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.groupGuid$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap(
            (groupGuid: string): Observable<GroupMembershipResponse> => {
              // switch outer observable to api req.
              return this.api.post(
                `${this.base}invitations/${groupGuid}/accept`
              );
            }
          ),
          tap((response: GroupMembershipResponse): void => {
            if (!response.done) {
              throw new Error(
                response?.message ?? 'An unknown error has occurred'
              );
            }
          }),
          catchError((e) => {
            this.handleRequestError(e, true);
            return of(null);
          })
        )
        .subscribe((response) => {
          this.inProgress$.next(false);

          if (response && response.status === 'success') {
            this.isMember$.next(true);
            this.isInvited$.next(false);
            return;
          }
        })
    );
  }

  /**
   * Decline an invitation to join the group
   *
   * @returns { void }
   */
  public declineInvitation(): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.groupGuid$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap(
            (groupGuid: string): Observable<GroupMembershipResponse> => {
              // switch outer observable to api req.
              return this.api.post(
                `${this.base}invitations/${groupGuid}/decline`
              );
            }
          ),
          tap((response: GroupMembershipResponse): void => {
            if (!response.done) {
              throw new Error(
                response?.message ?? 'An unknown error has occurred'
              );
            }
          }),
          catchError((e) => {
            this.handleRequestError(e, true);
            return of(null);
          })
        )
        .subscribe((response) => {
          this.inProgress$.next(false);

          if (response && response.status === 'success') {
            this.isInvited$.next(false);
            return;
          }
        })
    );
  }

  /**
   * Cancel a request to join a group
   * @returns { void }
   */
  public cancelRequest(): void {
    this.inProgress$.next(true);

    this.subscriptions.push(
      this.groupGuid$
        .pipe(
          take(1), // call once
          throttleTime(2000), // disallow more than 1 request every 2s
          switchMap(
            (groupGuid: string): Observable<GroupMembershipResponse> => {
              // switch outer observable to api req.
              return this.api.post(
                `${this.base}membership/${groupGuid}/cancel`
              );
            }
          ),
          tap((response: GroupMembershipResponse): void => {
            if (!response.done) {
              throw new Error(
                response?.message ?? 'An unknown error has occurred'
              );
            }
          }),
          catchError((e) => {
            this.handleRequestError(e, true);
            return of(null);
          })
        )
        .subscribe((response) => {
          this.inProgress$.next(false);

          if (response && response.status === 'success') {
            this.isAwaiting$.next(false);
            return;
          }
        })
    );
  }

  /**
   * Used by group moderator to accept a join request from targetUserGuid
   */
  acceptRequest(targetUserGuid: string) {
    return this.join({ targetUserGuid });
  }

  /**
   * Used by group moderator to reject a join request from targetUserGuid
   */
  rejectRequest(targetUserGuid: string) {
    return this.leave(targetUserGuid);
  }

  /**
   * Handle API errors.
   * @param { any } e - error from API.
   * @param { boolean } toast - whether to display error toasts.
   * @returns { Observable<null> } - will emit null.
   */
  private handleRequestError(e: any, toast: boolean = false): Observable<null> {
    this.inProgress$.next(false);

    if (toast) {
      this.toaster.error(
        e?.error?.message ?? e?.message ?? 'An unknown error has occurred'
      );
    }
    console.error(e);
    return of(null);
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }
}
