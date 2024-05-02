import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  lastValueFrom,
  Observable,
  Subscription,
} from 'rxjs';
import { ApiService } from '../../../common/api/api.service';
import { Session } from '../../../services/session';
import { filter, map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { MindsGroup } from './group.model';
import { GroupsService } from '../groups.service';
import { DEFAULT_GROUP_VIEW, GroupAccessType, GroupView } from './group.types';
import { ToasterService } from '../../../common/services/toaster.service';
import { IsTenantService } from '../../../common/services/is-tenant.service';
import { AuthModalService } from '../../auth/modal/auth-modal.service';

/**
 * Service that holds group information using Observables
 */
@Injectable()
export class GroupService implements OnDestroy {
  private baseEndpoint: string = 'api/v1/groups/';

  /**
   * Group GUID
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * The group
   */
  readonly group$: BehaviorSubject<MindsGroup> =
    new BehaviorSubject<MindsGroup>(null);

  /**
   * Whether user has access to group contents (feeds, members list, etc.)
   */
  readonly canAccess$: Observable<boolean>;

  /**
   * Whether to show the Review tab
   */
  readonly canReview$: Observable<boolean>;

  /**
   * Whether user can send an invitation to join the group
   */
  readonly canInvite$: Observable<boolean>;

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
   * Whether group is nsfw
   */
  readonly mature$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
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
  readonly isModerator$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /**
   * Whether current user is awaiting approval to join the group
   */
  readonly isAwaiting$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user is banned from the group
   */
  readonly isBanned$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /**
   * Whether current user has muted notifications for this group
   */
  readonly isMuted$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  /** Whether conversation is disabled. */
  readonly isCoversationDisabled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  /**
   * Whether boosts should be shown in the feed
   */
  readonly showBoosts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /**
   * Feed search query
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
   * (i.e. the currently selected top level tab)
   */
  readonly view$: BehaviorSubject<GroupView> = new BehaviorSubject<GroupView>(
    DEFAULT_GROUP_VIEW
  );

  subscriptions: Subscription[] = [];
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
    protected v1Service: GroupsService,
    protected toaster: ToasterService,
    protected router: Router,
    protected isTenant: IsTenantService,
    private authModal: AuthModalService
  ) {
    this.listenForLogin();
    // Set canReview observable
    this.canReview$ = combineLatest([this.isOwner$, this.isModerator$]).pipe(
      map(([isOwner, isModerator]) => isOwner || isModerator)
    );

    // Set canAccess observable
    this.canAccess$ = combineLatest([this.private$, this.isMember$]).pipe(
      map(([isPrivate, isMember]) => !isPrivate || (isPrivate && isMember))
    );

    // Set canInvite observable
    this.canInvite$ = combineLatest([
      this.private$,
      this.isMember$,
      this.isOwner$,
    ]).pipe(
      map(
        ([isPrivate, isMember, isOwner]) => isOwner || (!isPrivate && isMember)
      )
    );
  }

  /**
   * Refresh when user logs in
   */
  listenForLogin() {
    this.subscriptions.push(
      this.session.loggedinEmitter.pipe(filter(Boolean)).subscribe(() => {
        this.sync();
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  /**
   * Loads a new group
   * @param group the group or its guid
   */
  load(group: MindsGroup | string): void {
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

    this.subscriptions.push(
      this.api
        .get(`${this.baseEndpoint}group/${guid}`)
        .pipe(take(1))
        .subscribe((response) => {
          if (!this.session.isLoggedIn() && response['require_login']) {
            this.authModal.open({ formDisplay: 'register' });
            return;
          }
          this.setGroup(response.group);
          this.syncLegacyService(response.group);
        })
    );
  }

  /**
   * Sets the state based on a group
   */
  setGroup(group: MindsGroup | null): void {
    this.group$.next(group ? group : null);

    this.moderated$.next(group ? !!group.moderated : false);
    this.private$.next(
      group && group.membership === GroupAccessType.PRIVATE ? true : false
    );
    this.mature$.next(group ? group['mature'] : false);
    this.memberCount$.next(group ? group['members:count'] : 0);
    this.requestCount$.next(group ? group['requests:count'] : 0);
    this.reviewCount$.next(group ? group['adminqueue:count'] : 0);
    this.showBoosts$.next(this.getShowBoosts(group));

    // Note the subjects preceded by "is" relate to the user
    this.isOwner$.next(group ? group['is:owner'] : false);
    this.isCreator$.next(group ? group['is:creator'] : false);
    this.isMember$.next(group ? group['is:member'] : false);
    this.isModerator$.next(group ? group['is:moderator'] : false);
    this.isAwaiting$.next(group ? group['is:awaiting'] : false);
    this.isBanned$.next(group ? group['is:banned'] : false);
    this.isMuted$.next(group ? group['is:muted'] : false);
    this.isCoversationDisabled$.next(
      group ? group['conversationDisabled'] : true
    );
  }

  /**
   * Sync group for legacy components that are using GroupsService
   */
  public syncLegacyService(group: MindsGroup): void {
    this.v1Service.load(group);
  }

  /**
   * Never show boosts on network sites
   */
  private getShowBoosts(group?: MindsGroup): boolean {
    if (this.isTenant.is()) {
      return false;
    } else {
      return group
        ? group.show_boosts === undefined || group.show_boosts
        : true;
    }
  }

  //----------------------------------------------------------
  // GROUP SETTINGS & ACTIONS
  //----------------------------------------------------------
  /**
   * Mute/unmute notifications
   * @param { boolean } mute whether or not they should be muted
   * @returns { Promise<void> }
   */
  async toggleNotifications(enable: boolean): Promise<void> {
    let endpoint = `${this.baseEndpoint}notifications/${this.guid$.getValue()}`;
    if (enable) {
      endpoint = `${endpoint}/unmute`;
    } else {
      endpoint = `${endpoint}/mute`;
    }
    try {
      await lastValueFrom(this.api.post(endpoint));
      this.isMuted$.next(!enable);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Enable/disable boosts in the feed
   * @param { boolean } enable
   * @returns { Promise<void> }
   */
  async toggleShowBoosts(enable: boolean): Promise<void> {
    let endpoint = `${this.baseEndpoint}group/${this.guid$.getValue()}`;

    const params = {
      show_boosts: enable ? 1 : 0,
    };

    try {
      await lastValueFrom(this.api.post(endpoint, params));
      this.showBoosts$.next(enable);

      // Reload the feed
      this.sync();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Toggle whether the group is moderated
   * @param { boolean } enable
   * @returns { Promise<void> }
   */
  async toggleModeration(enable: boolean): Promise<void> {
    let endpoint = `${this.baseEndpoint}group/${this.guid$.getValue()}`;

    const params = {
      moderated: enable ? 1 : 0,
    };

    try {
      await lastValueFrom(this.api.post(endpoint, params));
      this.moderated$.next(enable);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Toggle whether the group is private/public
   * @param { boolean } enable
   * @returns { Promise<void> }
   */
  async togglePrivate(enable: boolean): Promise<void> {
    let endpoint = `${this.baseEndpoint}group/${this.guid$.getValue()}`;

    const params = {
      membership: enable ? GroupAccessType.PRIVATE : GroupAccessType.PUBLIC,
    };

    try {
      await lastValueFrom(this.api.post(endpoint, params));
      this.private$.next(enable);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Toggle whether the group is nsfw
   * (used by Minds admins only)
   * @param { boolean } enable
   * @returns { Promise<void> }
   */
  async toggleExplicit(enable: boolean): Promise<void> {
    try {
      await lastValueFrom(
        this.api.post(`api/v1/entities/explicit/${this.guid$.getValue()}`, {
          value: enable ? '1' : '0',
        })
      );
      this.mature$.next(enable);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Delete the group
   * @returns { Promise<void> }
   */
  async delete(): Promise<void> {
    let endpoint = `${this.baseEndpoint}group/${this.guid$.getValue()}`;

    try {
      await lastValueFrom(this.api.delete(endpoint));
      this.toaster.success('Your group has been successfully deleted');
      this.router.navigate(['/']);
    } catch (e) {
      console.error(e);
    }
  }

  //----------------------------------------------------------
  // MEMBER ACTIONS
  //----------------------------------------------------------
  /**
   * Kick a member out of a group
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async kick(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }membership/${this.guid$.getValue()}/kick`;

    const params = {
      user: userGuid,
    };

    try {
      await lastValueFrom(this.api.post(endpoint, params));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Ban a member from the group
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async ban(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }membership/${this.guid$.getValue()}/ban`;

    const params = {
      user: userGuid,
    };

    try {
      await lastValueFrom(this.api.post(endpoint, params));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Grant a member ownership
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async grantOwnership(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }management/${this.guid$.getValue()}/${userGuid}`;

    try {
      await lastValueFrom(this.api.put(endpoint));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Revoke a member's ownership
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async revokeOwnership(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }management/${this.guid$.getValue()}/${userGuid}`;

    try {
      await lastValueFrom(this.api.delete(endpoint));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Make a member a moderator
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async grantModerator(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }management/${this.guid$.getValue()}/${userGuid}/moderator`;

    try {
      await lastValueFrom(this.api.put(endpoint));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Remove a member's moderation status
   * @param { string } userGuid
   * @returns { Promise<void> }
   */
  async revokeModerator(userGuid: string): Promise<void> {
    let endpoint = `${
      this.baseEndpoint
    }management/${this.guid$.getValue()}/${userGuid}/moderator`;

    try {
      await lastValueFrom(this.api.delete(endpoint));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Set conversation disabled state.
   * @param { boolean } value - Whether conversation is disabled.
   * @returns { void }
   */
  public setConversationDisabled(value: boolean = true): void {
    this.isCoversationDisabled$.next(value);
  }
}
