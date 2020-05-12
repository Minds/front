import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FeedsService } from '../../../../common/services/feeds.service';

@Component({
  selector: 'm-channel__list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'list.component.html',
})
export class ChannelListComponent {
  @Input() feedsService: FeedsService;
}
