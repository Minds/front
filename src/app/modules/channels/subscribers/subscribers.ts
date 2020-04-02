import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-channel--subscribers',
  inputs: ['channel'],
  templateUrl: 'subscribers.html',
})
export class ChannelSubscribers {
  guid: string;
  users: Array<any> = [];

  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;

  constructor(public session: Session, public client: Client) {}

  set channel(value: any) {
    this.guid = value.guid;
    this.load();
  }

  load() {
    if (this.inProgress) return;
    this.inProgress = true;
    this.client
      .get('api/v1/subscribe/subscribers/' + this.guid, { offset: this.offset })
      .then((response: any) => {
        if (!response.users || response.users.length === 0) {
          this.moreData = false;
          this.inProgress = false;
          return;
        }

        if (response['load-next']) {
          this.offset = response['load-next'];
        } else {
          this.moreData = false;
        }

        this.users = this.users.concat(response.users);

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch(e => {
        this.inProgress = false;
      });
  }
}
