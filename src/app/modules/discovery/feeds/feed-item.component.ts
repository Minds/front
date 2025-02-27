import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';
import { FeedBoostCtaExperimentService } from '../../experiments/sub-services/feed-boost-cta-experiment.service';

@Component({
  selector: 'm-discovery__feedItem',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.ng.scss'],
})
export class DiscoveryFeedItemComponent {
  @Input() entity; // TODO add type

  @Input() slot: number = 0;

  @Input() openComments: boolean = false;
  readonly cdnUrl: string;

  /** Whether feed boost cta experiment is active. */
  protected isFeedBoostCtaExperimentActive: boolean = false;

  constructor(
    private feedBoostCtaExperimentService: FeedBoostCtaExperimentService,
    private configs: ConfigsService,
    private cd: ChangeDetectorRef
  ) {
    this.cdnUrl = configs.get('cdn_url');
    this.isFeedBoostCtaExperimentActive =
      this.feedBoostCtaExperimentService.isActive();
  }

  onDelete(activity): void {
    this.entity = null;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
