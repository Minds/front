import { Inject, Injectable, Injector } from '@angular/core';
import { ApiService } from '../../../../common/api/api.service';
import { Session } from '../../../../services/session';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { MembershipUpdate } from '../../groups.service';
import { map } from 'rxjs/operators';
import { UpdateMarkersService } from '../../../../common/services/update-markers.service';
import { Client } from '../../../../services/api/client';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { GroupEditModalComponent } from '../profile/edit/edit.component';

@Injectable()
export class GroupV2Service {
  /**
   * Group GUID
   */
  readonly guid$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Group data
   */
  readonly group$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  readonly banner$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  readonly avatar$: BehaviorSubject<File> = new BehaviorSubject<File>(null);

  readonly isMember$: Observable<boolean>;

  // Observable handling membership state.
  public membershipUpdate$: BehaviorSubject<
    MembershipUpdate
  > = new BehaviorSubject({
    show: null,
    guid: null,
  });

  constructor(
    protected overlayModalService: OverlayModalService,
    protected api: ApiService,
    protected client: Client,
    protected session: Session,
    @Inject(UpdateMarkersService) protected updateMarkers: UpdateMarkersService,
    protected injector: Injector
  ) {
    // Set isMember$ observable
    this.isMember$ = combineLatest([this.session.user$, this.group$]).pipe(
      map(([currentUser, group]) => currentUser && group && group['is:member'])
    );
  }

  /**
   * Load group from server
   */
  load(group: any | string): void {
    if (typeof group === 'string') {
      this.api.get(`api/v1/groups/group/${group}`).subscribe(response => {
        this.setGroup(response.group);
        this.guid$.next(group);
      });
    } else {
      this.setGroup(group);
      this.guid$.next(group.guid);
    }
  }

  /**
   * Sets the state based on a channel
   */
  setGroup(group: any): GroupV2Service {
    this.group$.next(group);
    //this.username$.next(channel ? channel.username : '');
    //this.email$.next(channel ? channel.email : null);
    //this.nsfw$.next(channel ? channel.nsfw : []);
    //this.rating$.next(channel ? channel.rating : 1);
    return this;
  }

  openEditModal() {
    this.overlayModalService
      .create(
        GroupEditModalComponent,
        { ...this.group$.getValue() },
        {
          wrapperClass: 'm-modalV2__wrapper',
          onSave: response => {
            this.load(response);
            this.overlayModalService.dismiss();
          },
          onDismissIntent: () => this.overlayModalService.dismiss(),
        },
        this.injector
      )
      .present();
  }

  // Membership

  kick(group: any, user: string): Observable<any> {
    return this.api.post(`api/v1/groups/membership/${group.guid}/kick`, {
      user,
    });
  }

  ban(group: any, user: string): Observable<any> {
    return this.api.post(`api/v1/groups/membership/${group.guid}/ban`, {
      user,
    });
  }

  join(target: string = null): Subscription {
    let endpoint = `api/v1/groups/membership/${this.guid$.getValue()}`;

    if (target) {
      endpoint += `/${target}`;
    }

    return this.api.put(endpoint).subscribe((response: any) => {
      if (response.done) {
        this.updateMembership(true);
        return true;
      }

      throw response.error ? response.error : 'Internal error';
    });
  }

  leave(target: string = null) {
    let endpoint = `api/v1/groups/membership/${this.guid$.getValue()}`;

    if (target) {
      endpoint += `/${target}`;
    }

    return this.api.delete(endpoint).subscribe((response: any) => {
      if (response.done) {
        this.updateMembership(false);
        return true;
      }

      throw response.error ? response.error : 'Internal error';
    });
  }

  cancelRequest(group: any) {
    return this.api.post(`api/v1/groups/membership/${group.guid}/cancel`);
  }

  // Notifications

  async muteNotifications(group: any) {
    this.updateMarkers.mute(group.guid);
    try {
      const response: any = await this.client.post(
        `api/v1/groups/notifications/${group.guid}/mute`
      );
      return !!response.done;
    } catch (e) {
      return false;
    }
  }

  async unmuteNotifications(group: any) {
    this.updateMarkers.unmute(group.guid);

    try {
      const response: any = await this.client.post(
        `api/v1/groups/notifications/${group.guid}/unmute`
      );
      return !!response.done;
    } catch (e) {
      return false;
    }
  }

  // Management

  grantOwnership(group: any, user: string): Observable<any> {
    return this.api.put(`api/v1/groups/management/${group.guid}/${user}`);
  }

  revokeOwnership(group: any, user: string): Observable<any> {
    return this.api.delete(`api/v1/groups/management/${group.guid}/${user}`);
  }

  acceptRequest(target: string) {
    return this.join(target);
  }

  rejectRequest(target: string) {
    // Same endpoint as leave
    return this.leave(target);
  }

  // Moderation

  grantModerator(group: any, user: string): Observable<any> {
    return this.api.put(
      `api/v1/groups/management/${group.guid}/${user}/moderator`
    );
  }

  revokeModerator(group: any, user: string): Observable<any> {
    return this.api.delete(
      `api/v1/groups/management/${group.guid}/${user}/moderator`
    );
  }

  // Invitations

  invite(group: any, invitee: any): Observable<any> {
    return this.api.put(`api/v1/groups/invitations/${group.guid}`, {
      guid: invitee.guid,
    });
  }

  acceptInvitation(group: any): Subscription {
    return this.api
      .post(`api/v1/groups/invitations/${group.guid}/accept`)
      .subscribe((response: any) => {
        return !!response.done;
      });
  }

  declineInvitation(group: any): Subscription {
    return this.api
      .post(`api/v1/groups/invitations/${group.guid}/decline`)
      .subscribe((response: any) => {
        return !!response.done;
      });
  }

  getReviewCount(guid: any): Subscription {
    return this.api
      .get(`api/v1/groups/review/${guid}/count`)
      .subscribe((response: any) => {
        if (typeof response['adminqueue:count'] !== 'undefined') {
          return parseInt(response['adminqueue:count'], 10);
        }

        throw 'E_COUNT';
      });
  }

  async setExplicit(guid: any, value: boolean) {
    try {
      const response: any = await this.client.post(
        `api/v1/entities/explicit/${guid}`,
        { value }
      );
      return !!response.done;
    } catch (e) {
      return false;
    }
  }

  async toggleConversation(guid: any, enabled: boolean) {
    const response: any = await this.client.post(
      `api/v1/groups/group/${guid}`,
      { conversationDisabled: !enabled }
    );
    return !!response.done;
  }

  async deleteGroup() {
    try {
      const response: any = await this.client.delete(
        `api/v2/groups/group/${this.guid$.getValue()}`
      );
      this.updateMembership(false);
      return !!response.done;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns the number of users belonging to a group
   */
  async countMembers(guid: any) {
    try {
      const response: any = await this.api.get(
        `api/v1/groups/membership/${guid}`
      );
      return response.members.length;
    } catch (e) {
      return -1;
    }
  }

  private updateMembership(show: boolean): void {
    this.membershipUpdate$.next({
      show: show,
      guid: this.guid$.getValue(),
    });
  }
}
