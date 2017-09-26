import { Component, EventEmitter, Input } from '@angular/core';

import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { KeyVal } from '../../../interfaces/entities';

export interface SocialProfileMeta {
  key: string;
  label: string;
  placeholder: string;
  link: string;
  icon: string;
  customIcon?: boolean;
}

@Component({
  moduleId: module.id,
  selector: 'm-channel--badges',
  templateUrl: 'badges.component.html'
})

export class ChannelBadgesComponent {

  @Input() user;

  constructor(public session: Session, private client: Client) { }

  verify() {
    if (this.user.verified)
      return this.unVerify();
    this.user.verified = true;
    this.client.put('api/v1/admin/verify/' + this.user.guid)
      .catch(() => {
        this.user.verified = false;
      });
  }

  unVerify() {
    this.user.verified = false;
    this.client.delete('api/v1/admin/verify/' + this.user.guid)
      .catch(() => {
        this.user.verified = true;
      });
  }

}
