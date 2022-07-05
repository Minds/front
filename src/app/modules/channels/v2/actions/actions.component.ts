import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Toolbar at top of channel banner, with options that change
 * depending on context of channel ownership (edit, boost, pro, dropdown with add'l options)
 */
@Component({
  selector: 'm-channel__actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'actions.component.html',
  styleUrls: ['actions.component.ng.scss'],
})
export class ChannelActionsComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelsV2Service) {}
}
