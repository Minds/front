import { Component, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DiscoveryFeedsService } from './feeds.service';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-discovery__feedItem',
  templateUrl: './feed-item.component.html',
})
export class DiscoveryFeedItemComponent {
  @Input() entity; // TODO add type
  @Input() openComments: boolean = false;
  readonly cdnUrl: string;

  constructor(configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }
}
