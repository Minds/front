import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Heading action bar
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
