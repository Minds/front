import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { Session } from '../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

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
  constructor(
    public service: ChannelsV2Service,
    public session: Session,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}
}
