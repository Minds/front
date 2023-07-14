import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GiftCardClaimPanelEnum } from './claim-panel.enum';
import { GiftCardProductIdEnum } from '../../../../../graphql/generated.engine';

/**
 * Gift card claim panel service. Holds state for active panel and product id.
 */
@Injectable({ providedIn: 'root' })
export class GiftCardClaimPanelService {
  /** Currently active panel. */
  public readonly activePanel$: BehaviorSubject<
    GiftCardClaimPanelEnum
  > = new BehaviorSubject<GiftCardClaimPanelEnum>(
    GiftCardClaimPanelEnum.Redeem
  );

  /** Currently active product id for the card the user is redeeming. */
  public readonly productId$: BehaviorSubject<
    GiftCardProductIdEnum
  > = new BehaviorSubject<GiftCardProductIdEnum>(GiftCardProductIdEnum.Boost);
}
