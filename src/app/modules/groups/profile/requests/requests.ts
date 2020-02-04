import { Component, Inject } from '@angular/core';

import { GroupsService } from '../../groups-service';

import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  selector: 'minds-groups-profile-requests',
  inputs: ['_group : group'],
  templateUrl: 'requests.html',
})
export class GroupsProfileRequests {
  readonly cdnUrl: string;
  group: any;
  $group;

  users: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;

  constructor(
    public session: Session,
    public client: Client,
    public service: GroupsService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.$group = this.service.$group.subscribe(group => {
      this.group = group;
      this.load(true);
    });
  }

  load(refresh: boolean = false) {
    if (this.inProgress) return;

    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.users = [];
    }

    this.inProgress = true;
    this.client
      .get('api/v1/groups/membership/' + this.group.guid + '/requests', {
        limit: 12,
        offset: this.offset,
      })
      .then((response: any) => {
        if (!response.users || response.users.length === 0) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (this.users && !refresh) {
          for (let user of response.users) this.users.push(user);
        } else {
          this.users = response.users;
        }
        this.offset = response['load-next'];
        this.inProgress = false;
      });
  }

  accept(user: any, index: number) {
    this.service.acceptRequest(this.group, user.guid).then(() => {
      this.users.splice(index, 1);
      this.changeCounter('members:count', +1);
      this.changeCounter('requests:count', -1);
    });
  }

  reject(user: any, index: number) {
    this.service.rejectRequest(this.group, user.guid).then(() => {
      this.users.splice(index, 1);
      this.changeCounter('requests:count', -1);
    });
  }

  private changeCounter(counter: string, val = 0) {
    if (typeof this.group[counter] !== 'undefined') {
      this.group[counter] = parseInt(this.group[counter], 10) + val;
    }
  }
}
