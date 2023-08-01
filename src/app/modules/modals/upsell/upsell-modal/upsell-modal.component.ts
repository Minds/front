import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WirePaymentHandlersService } from '../../../wire/wire-payment-handlers.service';
import { WireModalService } from '../../../wire/wire-modal.service';
import {
  WireEventType,
  WireUpgradeType,
} from '../../../wire/v2/wire-v2.service';

export type UpsellModalData = {
  onDismissIntent: () => any;
  onWireModalDismissIntent: () => any;
  onUpgradeComplete: () => any;
};
/**
 * Promotional modal that informs users about
 * free boost credits after they boost a post.
 *
 * Clicking on an upsell button opens the
 * corresponding upgrade wire modal.
 *
 * Completing an upgrade purchase redirects
 * to the Minds+ feed
 *
 * */
@Component({
  selector: 'm-upsellModal',
  templateUrl: './upsell-modal.component.html',
  styleUrls: ['./upsell-modal.component.ng.scss'],
})
export class UpsellModalComponent {
  constructor(
    private wirePaymentHandlers: WirePaymentHandlersService,
    private wireModal: WireModalService
  ) {}

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Wire modal was dismissed without
   * a completed upgrade
   */
  onWireModalDismissIntent: () => void = () => {};

  /**
   * User upgraded to plus or pro
   */
  onUpgradeComplete: () => void = () => {};

  async onClick(type: WireUpgradeType): Promise<void> {
    const handlerGuid = await this.wirePaymentHandlers.get(type);

    // Open the wire modal
    const wireEvent = await this.wireModal.present(handlerGuid, {
      default: {
        type: 'money',
        upgradeType: type,
      },
    });
    if (wireEvent.type === WireEventType.Completed) {
      this.onUpgradeComplete();
    } else {
      this.onWireModalDismissIntent();
    }
  }

  /**
   * Set modal data.
   * @param { UpsellModalData } data - data for upsell modal
   */
  public setModalData({
    onDismissIntent,
    onWireModalDismissIntent,
    onUpgradeComplete,
  }: UpsellModalData) {
    this.onDismissIntent = onDismissIntent ?? (() => {});
    this.onWireModalDismissIntent = onWireModalDismissIntent ?? (() => {});
    this.onUpgradeComplete = onUpgradeComplete ?? (() => {});
  }
}
