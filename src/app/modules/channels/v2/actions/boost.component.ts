import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { BoostCreatorComponent } from '../../../boost/creator/creator.component';
import { FeaturesService } from '../../../../services/features.service';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';

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
    protected overlayModal: OverlayModalService,
    private features: FeaturesService,
    private boostModal: BoostModalLazyService
  ) {}

  /**
   * Opens the boost modal
   */
  async onClick(e: MouseEvent): Promise<void> {
    if (this.features.has('boost-modal-v2')) {
      await this.boostModal.open(this.service.channel$.getValue());
      return;
    }

    const creator = this.overlayModal.create(
      BoostCreatorComponent,
      this.service.channel$.getValue()
    );
    creator.present();
  }
}
