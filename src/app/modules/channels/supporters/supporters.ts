import { Component } from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-channel--supporters',
  inputs: ['channel'],
  templateUrl: 'supporters.html'
})

export class ChannelSupporters {

  guid: string;
  users: Array<any> = [];

  offset: string = '';
  moreData: boolean = true;
  inProgress: boolean = false;

  constructor(public session: Session, public client: Client) {
  }

  set channel(value: any) {
    this.guid = value.guid;
    this.load();
  }

  load() {
    if (this.inProgress)
      return;
    this.inProgress = true;
    this.client.get('api/v1/payments/subscribers/' + this.guid + '/exclusive', { offset: this.offset })
      .then((response: any) => {

        if (!response.subscribers || response.subscribers.length === 0) {
          this.moreData = false;
          this.inProgress = false;
          return;
        }

        this.users = this.users.concat(response.subscribers);

        this.offset = response['load-next'];
        this.inProgress = false;
      })
      .catch((e) => {
        this.inProgress = false;
      });
  }

}
