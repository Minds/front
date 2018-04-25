import { Component, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() badges: Array<string> = [ 'verified', 'plus', 'founder' ];

  constructor(public session: Session, private client: Client, private router: Router) { }

  verify(e) {
    if (!this.session.isAdmin()) {
      e.preventDefault();
      return this.router.navigate(['/plus']);
    }
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

  setFounder(e) {
    if (!this.session.isAdmin()) {
      e.preventDefault();
      return this.router.navigate(['/channels/founders']);
    }
    if (this.user.founder)
      return this.unsetFounder();
    this.user.founder = true;
    this.client.put('api/v1/admin/founder/' + this.user.guid)
      .catch(() => {
        this.user.founder = false;
      });
  }

  unsetFounder() {
    this.user.founder = false;
    this.client.delete('api/v1/admin/founder/' + this.user.guid)
      .catch(() => {
        this.user.founder = true;
      });
  }

}
