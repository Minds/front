import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { MindsUser } from '../../../../interfaces/entities';
import { Session } from '../../../../services/session';

/**
 * Channel About component
 * Displayed when "about" tab is selected on a channel page
 */
@Component({
  selector: 'm-channel__about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'about.component.html',
})
export class ChannelAboutComponent {
  /**
   * Constructor
   * @param service
   * @param session
   */
  constructor(public service: ChannelsV2Service, public session: Session) {}
}
