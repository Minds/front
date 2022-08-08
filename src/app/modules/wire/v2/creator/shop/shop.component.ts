import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import { ShopService } from './shop.service';
import { SupportTier, SupportTiersService } from '../../support-tiers.service';

/**
 * Allows a tipping user to select from a dropdown of memberships (aka support tiers).
 *
 * Also contains a link to the recipient's channel shop
 *
 */
@Component({
  selector: 'm-wireCreator__shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'shop.component.html',
  styleUrls: ['shop.component.ng.scss'],
  providers: [ShopService],
})
export class WireCreatorShopComponent {
  /**
   * Dismiss intent event emitter
   */
  @Output('onDismissIntent') dismissIntentEmitter: EventEmitter<
    void
  > = new EventEmitter<void>();

  /**
   * Constructor
   * @param service
   * @param shop
   */
  constructor(public service: WireV2Service, public shop: ShopService) {}

  /**
   * Triggers the dismiss modal event
   */
  dismiss() {
    this.dismissIntentEmitter.emit();
  }

  /**
   * Compare 2 support tiers by their URN. Used by <select>
   * @param a
   * @param b
   */
  byUrn(a: SupportTier, b: SupportTier) {
    return a && b && a.urn === b.urn;
  }
}
