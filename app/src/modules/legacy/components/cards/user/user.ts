import { Component } from '@angular/core';

import { SessionFactory } from '../../../../../services/session';
import { Client } from '../../../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'minds-card-user',
  inputs: ['object', 'avatarSize'],
  templateUrl: 'user.html'
})

export class UserCard {

  user: any;
  session = SessionFactory.build();
  minds = window.Minds;
  avatarSize: string = 'medium';
  bannerSrc: string;

  constructor(public client: Client) {
  }

  set object(value: any) {
    this.user = value;
    this.bannerSrc = `${this.minds.cdn_url}fs/v1/banners/${this.user.guid}/fat/${this.user.icontime}`;
  }

}
