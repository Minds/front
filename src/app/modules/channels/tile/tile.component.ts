import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  moduleId: module.id,
  selector: 'm-channels--tile',
  templateUrl: 'tile.component.html',
})
export class ChannelsTileComponent {
  @Input() entity;
  readonly cdnUrl;

  constructor(public session: Session, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }
}
