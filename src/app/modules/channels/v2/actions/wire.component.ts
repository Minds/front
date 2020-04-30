import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { WireCreatorComponent } from '../../../wire/creator/creator.component';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

/**
 * Wire (pay) button (non-owner)
 */
@Component({
  selector: 'm-channelActions__wire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'wire.component.html',
})
export class ChannelActionsWireComponent {
  /**
   * Constructor
   * @param service
   * @param overlayModal
   */
  constructor(
    public service: ChannelsV2Service,
    protected overlayModal: OverlayModalService
  ) {}

  /**
   * Wires the active channel
   */
  wire(): void {
    // TODO: Change with Wire v2 modal call
    this.overlayModal
      .create(WireCreatorComponent, this.service.channel$.getValue())
      .present();
  }
}
