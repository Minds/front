import { ConfigsService } from '../../../common/services/configs.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-embed-topbar',
  templateUrl: './embed-topbar.component.html',
  styleUrls: ['./embed-topbar.component.scss'],
})
export class EmbedTopbarComponent implements OnInit {
  @Input()
  entity: any;

  @Input()
  visible: boolean = true;

  siteUrl: string;
  cdnAssetsUrl: string;

  constructor(private configs: ConfigsService) {
    this.siteUrl = configs.get('site_url');
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  get title() {
    return (
      this.entity.title ||
      `${this.entity.ownerObj.username}'s ${this.entity.subtype}`
    );
  }

  get avatarSrc() {
    const user = this.entity.ownerObj;
    return `${this.configs.get('cdn_url')}icon/${user.guid}/large/${
      user.icontime
    }`;
  }

  get channelUrl() {
    return this.configs.get('site_url') + this.entity.ownerObj.username;
  }

  get mediaUrl() {
    return this.configs.get('site_url') + 'media/' + this.entity.guid;
  }

  ngOnInit(): void {}
}
