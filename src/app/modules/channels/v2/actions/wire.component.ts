import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { WireModalService } from '../../../wire/wire-modal.service';

/**
 * Wire (pay) button (non-owner) - action button shown to channel visitors.
 * Clicking it opens the pay modal if the user is logged in,
 * and opens the auth modal if they are logged out
 */
@Component({
  selector: 'm-channelActions__wire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'wire.component.html',
  styleUrls: ['wire.component.ng.scss'],
})
export class ChannelActionsWireComponent {
  /**
   * Constructor
   * @param service
   * @param wireModal
   */
  constructor(
    public service: ChannelsV2Service,
    protected wireModal: WireModalService
  ) {}

  /**
   * Wires the active channel
   */
  async wire(): Promise<void> {
    await this.wireModal.present(this.service.channel$.getValue());
  }
}
