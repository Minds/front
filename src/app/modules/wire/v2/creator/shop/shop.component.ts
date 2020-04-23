import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';
import { ShopService } from './shop.service';

/**
 * Shop (Wire Reward Tiers) component
 */
@Component({
  selector: 'm-wireCreator__shop',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'shop.component.html',
  providers: [ShopService],
})
export class WireCreatorShopComponent {
  /**
   * Constructor
   * @param service
   * @param shop
   */
  constructor(public service: WireV2Service, protected shop: ShopService) {}
}
