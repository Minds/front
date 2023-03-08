import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { ModalService } from '../../../../services/ux/modal.service';

/**
 * Boost button (owner)
 */
@Component({
  selector: 'm-channelActions__boost',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'boost.component.html',
})
export class ChannelActionsBoostComponent {
  constructor(
    public service: ChannelsV2Service,
    protected modalService: ModalService,
    private boostModal: BoostModalLazyService
  ) {}

  /**
   * Opens the boost modal
   */
  async onClick(e: MouseEvent): Promise<void> {
    await this.boostModal.open(this.service.channel$.getValue());
  }
}
