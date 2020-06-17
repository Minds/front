import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DiscoveryFeedsService } from './feeds.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { MetaService } from '../../../common/services/meta.service';

@Component({
  selector: 'm-discovery__feedItem',
  templateUrl: './feed-item.component.html',
})
export class DiscoveryFeedItemComponent implements OnInit {
  @Input() entity; // TODO add type
  @Input() openComments: boolean = false;
  readonly cdnUrl: string;

  constructor(
    private configs: ConfigsService,
    private metaService: MetaService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit(): void {
    this.metaService.setCanonicalUrl(`/newsfeed/${this.entity.guid}`);
  }
}
