import { Component } from '@angular/core';

import { Session } from '../../../../../services/session';
import { Client } from '../../../../../services/api';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'minds-card-user',
  inputs: ['object', 'avatarSize'],
  templateUrl: 'user.html',
})
export class UserCard {
  user: any;
  readonly cdnUrl: string;
  avatarSize: string = 'medium';
  bannerSrc: string;

  constructor(
    public session: Session,
    public client: Client,
    private configs: ConfigsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  set object(value: any) {
    this.user = value;
    this.bannerSrc = `${this.configs.get('cdn_url')}fs/v1/banners/${
      this.user.guid
    }/fat/${this.user.icontime}`;
  }
}
