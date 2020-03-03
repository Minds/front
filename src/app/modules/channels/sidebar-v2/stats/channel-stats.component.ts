import { Component, Input } from '@angular/core';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-channelstats',
  templateUrl: 'channel-stats.component.html',
})
export class ChannelStatsComponent {
  @Input() user: MindsUser;

  constructor(public session: Session) {}
}
