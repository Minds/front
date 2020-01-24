import { Inject, EventEmitter } from '@angular/core';
import { Client, Upload } from '../../services/api';
import { UpdateMarkersService } from '../../common/services/update-markers.service';
import { BehaviorSubject } from 'rxjs';

export interface MembershipUpdate {
  show: boolean;
  guid: string;
}

/**
 * Service for groups.
 */
export class GroupsService {
  private base: string = 'api/v1/groups/';

  private infiniteInProgress: boolean = false;
  private infiniteOffset: any;

  group = new BehaviorSubject(null);
  $group = this.group.asObservable();

  // Observable handling membership state.
  public membershipUpdate$: BehaviorSubject<
    MembershipUpdate
  > = new BehaviorSubject({
    show: null,
    guid: null,
  });

  static _(
    client: Client,
    upload: Upload,
    updateMarkers: UpdateMarkersService
  ) {
    return new GroupsService(client, upload, updateMarkers);
  }

  constructor(
    @Inject(Client) public clientService: Client,
    @Inject(Upload) public uploadService: Upload,
    @Inject(UpdateMarkersService) private updateMarkers: UpdateMarkersService
  ) {}

  // Group

  load(guid: string) {
    return this.clientService
      .get(`${this.base}group/${guid}`)
      .then((response: any) => {
        if (response.group) {
          this.group.next(response.group);
          return response.group;
        }

        throw 'E_LOADING';
      });
  }

  save(group: any) {
    let endpoint = `${this.base}group`;

    if (group.guid) {
      endpoint += `/${group.guid}`;
    }

    this.group.next(group);

    return this.clientService.post(endpoint, group).then((response: any) => {
      if (response.guid) {
        return response.guid;
      }

      throw 'E_SAVING';
    });
  }

  upload(group: any, files: any) {
    let uploads = [];

    if (files.banner) {
      uploads.push(
        this.uploadService.post(
          `${this.base}group/${group.guid}/banner`,
          [files.banner],
          {
            banner_position: group.banner_position,
          }
        )
      );
    }

    if (files.avatar) {
      uploads.push(
        this.uploadService.post(`${this.base}group/${group.guid}/avatar`, [
          files.avatar,
        ])
      );
    }

    return Promise.all(uploads);
  }

  deleteGroup(group: any) {
    return this.clientService
      .delete(`${this.base}group/${group.guid}`)
      .then((response: any) => {
        this.updateMembership(false, group.guid);
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  /**
   * Emits membership changes to subscribed components.
   * @param { boolean } - whether or not observable should be shown or hidden.
   * @param { string } - the GUID of the observable.
   */
  updateMembership(show: boolean, guid: string): void {
    this.membershipUpdate$.next({
      show: show,
      guid: guid,
    });
  }

  // Membership

  join(group: any, target: string = null) {
    let endpoint = `${this.base}membership/${group.guid}`;

    if (target) {
      endpoint += `/${target}`;
    }

    return this.clientService.put(endpoint).then((response: any) => {
      if (response.done) {
        this.updateMembership(true, group.guid);
        return true;
      }

      throw response.error ? response.error : 'Internal error';
    });
  }

  leave(group: any, target: string = null) {
    let endpoint = `${this.base}membership/${group.guid}`;

    if (target) {
      endpoint += `/${target}`;
    }

    return this.clientService.delete(endpoint).then((response: any) => {
      if (response.done) {
        this.updateMembership(false, group.guid);
        return true;
      }

      throw response.error ? response.error : 'Internal error';
    });
  }

  acceptRequest(group: any, target: string) {
    // Same endpoint as join
    return this.join(group, target);
  }

  rejectRequest(group: any, target: string) {
    // Same endpoint as leave
    return this.leave(group, target);
  }

  kick(group: any, user: string) {
    return this.clientService
      .post(`${this.base}membership/${group.guid}/kick`, { user })
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  ban(group: any, user: string) {
    return this.clientService
      .post(`${this.base}membership/${group.guid}/ban`, { user })
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  cancelRequest(group: any) {
    return this.clientService
      .post(`${this.base}membership/${group.guid}/cancel`)
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  // Notifications

  muteNotifications(group: any) {
    this.updateMarkers.mute(group.guid);
    return this.clientService
      .post(`${this.base}notifications/${group.guid}/mute`)
      .then((response: any) => {
        return !!response['is:muted'];
      })
      .catch(e => {
        return false;
      });
  }

  unmuteNotifications(group: any) {
    this.updateMarkers.unmute(group.guid);
    return this.clientService
      .post(`${this.base}notifications/${group.guid}/unmute`)
      .then((response: any) => {
        return !!response['is:muted'];
      })
      .catch(e => {
        return true;
      });
  }

  // Management

  grantOwnership(group: any, user: string) {
    return this.clientService
      .put(`${this.base}management/${group.guid}/${user}`)
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  revokeOwnership(group: any, user: string) {
    return this.clientService
      .delete(`${this.base}management/${group.guid}/${user}`)
      .then((response: any) => {
        return !response.done;
      })
      .catch(e => {
        return true;
      });
  }

  // Moderation

  grantModerator(group: any, user: string) {
    return this.clientService
      .put(`${this.base}management/${group.guid}/${user}/moderator`)
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  revokeModerator(group: any, user: string) {
    return this.clientService
      .delete(`${this.base}management/${group.guid}/${user}/moderator`)
      .then((response: any) => {
        return !response.done;
      })
      .catch(e => {
        return true;
      });
  }

  // Invitations

  canInvite(user: string) {
    return this.clientService
      .post(`${this.base}invitations/check`, { user })
      .then((response: any) => {
        if (response.done) {
          return user;
        }

        throw 'E_NOT_DONE';
      });
  }

  invite(group: any, invitee: any) {
    return this.clientService
      .put(`${this.base}invitations/${group.guid}`, { guid: invitee.guid })
      .then((response: any) => {
        if (response.done) {
          return true;
        }

        throw response.error ? response.error : 'Internal error';
      })
      .catch(e => {
        throw typeof e === 'string' ? e : 'Connectivity error';
      });
  }

  acceptInvitation(group: any) {
    return this.clientService
      .post(`${this.base}invitations/${group.guid}/accept`)
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  declineInvitation(group: any) {
    return this.clientService
      .post(`${this.base}invitations/${group.guid}/decline`)
      .then((response: any) => {
        return !!response.done;
      })
      .catch(e => {
        return false;
      });
  }

  getReviewCount(guid: any): Promise<number> {
    return this.clientService
      .get(`${this.base}review/${guid}/count`)
      .then((response: any) => {
        if (typeof response['adminqueue:count'] !== 'undefined') {
          return parseInt(response['adminqueue:count'], 10);
        }

        throw 'E_COUNT';
      });
  }

  setExplicit(guid: any, value: boolean): Promise<boolean> {
    return this.clientService
      .post(`api/v1/entities/explicit/${guid}`, { value })
      .then((response: any) => {
        return !!response.done;
      });
  }

  /**
   * Returns the number of users belonging to a group
   */
  countMembers(guid: any) {
    return this.clientService
      .get(`api/v1/groups/membership/${guid}`)
      .then(res => res['members'].length);
  }
}
