import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DiscoveryFeedsService } from './feeds.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { MetaService } from '../../../common/services/meta.service';
import { ExperimentsService } from '../../experiments/experiments.service';

@Component({
  selector: 'm-discovery__feedItem',
  templateUrl: './feed-item.component.html',
})
export class DiscoveryFeedItemComponent implements OnInit {
  @Input() entity; // TODO add type

  @Input() openComments: boolean = false;
  readonly cdnUrl: string;

  activityV2Feature: boolean = false;

  constructor(
    private configs: ConfigsService,
    private cd: ChangeDetectorRef,
    private experiments: ExperimentsService
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  ngOnInit(): void {
    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }

  onDelete(activity): void {
    this.entity = null;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
