import { Component, Input } from '@angular/core';

import { Session } from '../../../../../services/session';
import { Client } from '../../../../../services/api';
import { ConfigsService } from '../../../../../common/services/configs.service';

/**
 * User card
 *
 * Used only in group memberships, should be removed
 */
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
  forceShowSubscribe: boolean = false;

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
