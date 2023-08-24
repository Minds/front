import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  switchMap,
  take,
  throttleTime,
} from 'rxjs';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MindsGroup } from '../group.model';
import { MindsUser } from '../../../../interfaces/entities';
import { GroupInvitePutParams, GroupInvitePutResponse } from '../group.types';
import { Session } from '../../../../services/session';

/**
 * Hold invite modal component state and interact with the API
 */
@Injectable()
export class GroupInviteService implements OnDestroy {
  /**
   * Group subject, should be immutable; Used for display purposes
   */
  readonly group$: BehaviorSubject<MindsGroup> = new BehaviorSubject<
    MindsGroup
  >(null);

  /**
   * The currently logged in user
   */
  readonly loggedInUser$: BehaviorSubject<MindsUser> = new BehaviorSubject<
    MindsUser
  >(null);

  /**
   * In Progress flag subject
   */
  readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  subscriptions: Subscription[] = [];

  /**
   * Constructor
   * @param api
   */
  constructor(
    protected api: ApiService,
    private toaster: ToasterService,
    private session: Session
  ) {}

  /**
   * @param group
   */
  setGroup(group: MindsGroup): GroupInviteService {
    this.loggedInUser$.next(this.session.getLoggedInUser());
    this.group$.next(group);

    return this;
  }

  /**
   * Invite to join
   *
   * @param invitee user to invite to the group
   * @returns { void }
   */
  public invite(invitee: MindsUser): void {
    this.inProgress$.next(true);

    const inviteResponse$ = this.group$.pipe(
      take(1),
      switchMap(
        (group): Observable<GroupInvitePutResponse> => {
          let endpoint = `api/v1/groups/invitations/${group.guid}`;
          let params: GroupInvitePutParams = {
            guid: invitee.guid,
          };

          return this.api.put(endpoint, params);
        }
      ),
      catchError(e => {
        this.inProgress$.next(false);
        this.handleRequestError(e, true);
        return of(null);
      })
    );

    this.subscriptions.push(
      inviteResponse$
        .pipe(
          map(response => {
            this.inProgress$.next(false);

            if (response.done) {
              this.toaster.success(`@${invitee.name} has been invited to join`);
            }
            return;
          })
        )
        .subscribe()
    );
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
      this.toaster.error(e.error ?? 'An unknown error has occurred');
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
