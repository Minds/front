import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';

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
    protected overlayModal: OverlayModalService
  ) {}

  /**
   * Opens the boost modal
   */
  async onClick(e: MouseEvent): Promise<void> {
    const creator = this.overlayModal.create(
      BoostCreatorComponent,
      this.service.channel$.getValue()
    );
    creator.present();
  }
}
