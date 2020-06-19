import { Component, OnInit } from '@angular/core';
import { Client } from '../../../../../../services/api/client';
import { GroupV2Service } from '../../../services/group-v2.service';
import { FormToastService } from '../../../../../../common/services/form-toast.service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { Session } from '../../../../../../services/session';

@Component({
  selector: 'm-groupMembers__invite',
  templateUrl: 'modal.component.html',
})
export class GroupsMemberInviteModalComponent implements OnInit {
  readonly cdnUrl: string;

  group: any;

  requests: Array<any> = [];
  users: Array<any> = [];
  searching: boolean = false;
  q: string = '';

  inviteInProgress: boolean = false;
  inviteLastUser: string = '';
  inviteError: string = '';

  inProgress: boolean = false;
  offset: string = '';
  moreData: boolean = true;

  timeout;

  constructor(
    configs: ConfigsService,
    public service: GroupV2Service,
    public session: Session,
    private toasterService: FormToastService,
    private client: Client
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.group = this.service.group$.getValue();
  }

  ngOnInit() {
    this.loadRequests(true);
  }

  /**
   * Invites a user to join the group
   * @param user
   */
  invite(user) {
    if (!user.subscriber) {
      return this.toasterService.error(
        'You can only invite users who are subscribed to you'
      );
    }

    this.q = '';
    this.requests = [];
    if (!this.group) {
      return;
    }
    this.inviteInProgress = true;
    this.inviteLastUser = '';
    this.inviteError = '';

    this.service.invite(this.group, user).subscribe((response: any) => {
      this.inviteInProgress = false;
    });
  }

  /**
   * Search for users
   * @param q
   */
  search(q: string) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.searching = true;
    if (this.q.charAt(0) !== '@') {
      this.q = '@' + this.q;
    }

    let query = this.q;
    if (query.charAt(0) === '@') {
      query = query.substr(1);
    }

    this.timeout = setTimeout(async () => {
      try {
        const response: any = await this.client.get(
          `api/v2/search/suggest/user`,
          {
            q: query,
            limit: 5,
            hydrate: 1,
          }
        );
        if (response.entities) {
          this.users = response.entities;
        }
      } catch (error) {
        console.log(error);
      }
    }, 600);
  }

  /**
   * Loads the list of join requests
   * @param refresh
   */
  loadRequests(refresh: boolean = false) {
    if (this.inProgress) {
      return;
    }

    if (refresh) {
      this.offset = '';
      this.moreData = true;
      this.requests = [];
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

        if (this.requests && !refresh) {
          for (const user of response.users) {
            this.requests.push(user);
          }
        } else {
          this.requests = response.users;
        }
        this.offset = response['load-next'];
        this.inProgress = false;
      });
  }

  /**
   * Accept a join request
   * @param user
   * @param index
   */
  async accept(user: any, index: number) {
    await this.service.acceptRequest(user.guid);

    this.requests.splice(index, 1);
    this.changeCounter('members:count', +1);
    this.changeCounter('requests:count', -1);
  }

  /**
   * Reject a join request
   * @param user
   * @param index
   */
  async reject(user: any, index: number) {
    await this.service.rejectRequest(user.guid);

    this.requests.splice(index, 1);
    this.changeCounter('requests:count', -1);
  }

  /**
   * Called when the invitation is changed (either by accepting or rejecting it)
   * @param guid
   */
  invitationUpdated(guid: string) {
    const index = this.requests.findIndex(item => item.guid === guid);
    this.requests.splice(index, 1);
  }

  private changeCounter(counter: string, val = 0) {
    if (typeof this.group[counter] !== 'undefined') {
      this.group[counter] = parseInt(this.group[counter], 10) + val;
    }
  }
}
