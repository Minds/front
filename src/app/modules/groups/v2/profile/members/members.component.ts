import { Component, OnInit } from '@angular/core';
import { GroupV2Service } from '../../services/group-v2.service';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { GroupsMemberInviteModalComponent } from './modal/modal.component';

@Component({
  selector: 'm-group__members',
  templateUrl: 'members.component.html',
})
export class GroupMembersComponent implements OnInit {
  members: any[] = [];
  inProgress: boolean = false;
  limit: number = 12;
  offset: string = '';
  moreData: boolean = true;

  query: string = '';
  canSearch: boolean = true;

  inputFocused: boolean = false;
  private searchDelayTimer;

  /**
   * Constructor
   * @param service
   * @param overlayModalService
   * @param client
   * @param session
   */
  constructor(
    public service: GroupV2Service,
    public overlayModalService: OverlayModalService,
    public client: Client,
    public session: Session
  ) {}

  ngOnInit() {
    this.load();
  }

  /**
   * Loads the list of members
   * @param refresh
   */
  async load(refresh: boolean = false) {
    this.inProgress = true;

    if (refresh) {
      this.members = [];
      this.offset = '';
    }

    let endpoint: string = `api/v1/groups/membership/${this.service.guid$.getValue()}`;

    const params: { limit: number; offset: string; q?: string } = {
      limit: this.limit,
      offset: this.offset,
    };

    if (this.query) {
      endpoint = `${endpoint}/search`;
      params.q = this.query;
    }

    try {
      const response: any = await this.client.get(endpoint, params);

      if (!response.members) {
        this.moreData = false;
        this.inProgress = false;

        return;
      }

      if (response['load-next']) {
        this.offset = response['load-next'];
      } else {
        this.moreData = false;
      }

      this.members = this.members.concat(response.members);

      this.inProgress = false;
    } catch (e) {
      this.inProgress = false;
    }
  }

  /**
   * Filters the list of members
   * @param query
   */
  async search(query: string) {
    if (this.searchDelayTimer) {
      clearTimeout(this.searchDelayTimer);
    }

    this.query = query;
    this.searchDelayTimer = setTimeout(() => {
      this.load(true);
    }, 300);
  }

  invite() {
    this.overlayModalService.create(GroupsMemberInviteModalComponent).present();
  }
}
