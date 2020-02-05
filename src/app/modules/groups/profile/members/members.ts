import { Component, ViewChild } from '@angular/core';

import { GroupsService } from '../../groups-service';

import { MindsHttpClient } from '../../../../common/api/client.service';
import { map } from 'rxjs/operators';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'minds-groups-profile-members',

  inputs: ['_group : group'],
  templateUrl: 'members.html',
})
export class GroupsProfileMembers {
  readonly cdnUrl: string;
  @ViewChild('el', { static: true }) el;

  group: any;
  $group;

  invitees: any = [];
  members: Array<any> = [];
  offset: string = '';
  inProgress: boolean = false;
  moreData: boolean = true;
  canInvite: boolean = false;

  q: string = '';

  private lastQuery;
  private searchDelayTimer;

  httpSubscription;

  constructor(
    public session: Session,
    public client: MindsHttpClient,
    public service: GroupsService,
    configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit() {
    this.$group = this.service.$group.subscribe(group => {
      this.group = group;
      this.load(true);
      this.el.nativeElement.scrollIntoView();
    });
  }

  ngOnDestroy() {
    if (this.searchDelayTimer) {
      clearTimeout(this.searchDelayTimer);
    }
    this.$group.unsubscribe();
  }

  load(refresh: boolean = false, query = null) {
    if (this.httpSubscription) this.httpSubscription.unsubscribe();

    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.members = [];
    }

    // TODO: [emi] Send this via API
    this.canInvite = false;

    if (this.group['is:owner']) {
      this.canInvite = true;
    } else if (this.group.membership === 2 && this.group['is:member']) {
      this.canInvite = true;
    }

    let endpoint = `api/v1/groups/membership/${this.group.guid}`,
      params: { limit; offset; q?: string } = {
        limit: 12,
        offset: this.offset,
      };

    if (this.q) {
      endpoint = `${endpoint}/search`;
      params.q = this.q;
    }

    this.inProgress = true;
    this.httpSubscription = this.client.get(endpoint, params).subscribe(
      (response: any) => {
        console.log(response);
        if (!response.members) {
          this.moreData = false;
          this.inProgress = false;
          return false;
        }

        if (refresh) {
          this.members = response.members;
        } else {
          this.members = this.members.concat(response.members);
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.inProgress = false;
      },
      err => {
        this.inProgress = false;
      }
    );
  }

  invite(user: any) {
    for (let i of this.invitees) {
      if (i.guid === user.guid) return;
    }
    this.invitees.push(user);
  }

  search(q) {
    if (this.searchDelayTimer) {
      clearTimeout(this.searchDelayTimer);
    }

    this.q = q;
    this.searchDelayTimer = setTimeout(() => {
      this.load(true);
    }, 300);
  }
}
