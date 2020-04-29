import { Component, EventEmitter } from '@angular/core';

import { Client } from '../../../../../services/api';
import { GroupsService } from '../../../groups.service';
import { PermissionsService } from '../../../../../common/services/permissions/permissions.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { FeaturesService } from '../../../../../services/features.service';
import { Flags } from '../../../../../common/services/permissions/flags';

@Component({
  moduleId: module.id,
  selector: 'minds-groups-profile-members-invite',
  inputs: ['_group : group'],
  outputs: ['invited'],
  templateUrl: 'invite.html',
})
export class GroupsProfileMembersInvite {
  readonly cdnUrl: string;

  group: any;
  invited: EventEmitter<any> = new EventEmitter();

  users: Array<any> = [];
  searching: boolean = false;
  q: string = '';

  inviteInProgress: boolean = false;
  inviteLastUser: string = '';
  inviteError: string = '';

  destination: any; // @todo: ??

  timeout;

  constructor(
    public client: Client,
    public service: GroupsService,
    private permissionsService: PermissionsService,
    private featuresService: FeaturesService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  set _group(value: any) {
    this.group = value;
  }

  invite(user) {
    if (!user.subscriber) {
      return alert('You can only invite users who are subscribed to you');
    }

    if (
      this.featuresService.has('permissions') &&
      !this.permissionsService.canInteract(this.group, Flags.INVITE)
    ) {
      return alert("You're not allowed to invite users to this group");
    }

    this.invited.next(user);

    this.q = '';
    this.users = [];
    if (!this.group) {
      return;
    }
    this.inviteInProgress = true;
    this.inviteLastUser = '';
    this.inviteError = '';

    this.service
      .invite(this.group, user)
      .then(() => {
        this.inviteInProgress = false;
      })
      .catch(e => {
        this.inviteInProgress = false;
        this.inviteError = e;
      });
  }

  search(q) {
    if (this.timeout) clearTimeout(this.timeout);

    this.searching = true;
    if (this.q.charAt(0) !== '@') {
      this.q = '@' + this.q;
    }

    var query = this.q;
    if (query.charAt(0) === '@') {
      query = query.substr(1);
    }

    this.timeout = setTimeout(() => {
      this.client
        .get(`api/v2/search/suggest/user`, {
          q: query,
          limit: 5,
          hydrate: 1,
        })
        .then((success: any) => {
          if (success.entities) {
            this.users = success.entities;
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 600);
  }
}
