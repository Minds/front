import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-modal--tos-updated',
  templateUrl: 'tos.component.html',
})
export class TOSUpdatedModal {
  user;
  readonly siteUrl: string;
  readonly lastTosUpdate: number;
  showModal: boolean = false;

  constructor(
    private client: Client,
    private session: Session,
    configs: ConfigsService
  ) {
    this.siteUrl = configs.get('site_url');
    this.lastTosUpdate = configs.get('last_tos_update');
  }

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    if (this.session.getLoggedInUser().last_accepted_tos < this.lastTosUpdate) {
      this.showModal = true;
    }
  }

  async updateUser() {
    try {
      const response: any = await this.client.post('api/v2/settings/tos');
      this.user.last_accepted_tos = response.timestamp;
    } catch (e) {
      console.error(e);
    }
  }

  close(e) {
    this.updateUser();
    this.showModal = false;
  }
}
