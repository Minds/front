import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';

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

  constructor(
    private configs: ConfigsService,
    private cd: ChangeDetectorRef
  ) {
    this.cdnUrl = configs.get('cdn_url');
  }

  onDelete(activity): void {
    this.entity = null;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
