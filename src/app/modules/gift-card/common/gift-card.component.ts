import { Component, Input } from '@angular/core';
import { ThemeService } from '../../../common/services/theme.service';
import { Observable } from 'rxjs';
import {
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../../graphql/generated.engine';

/**
 * Minds Gift Card component - shows a card like representation of a gift card.
 */
@Component({
  selector: 'm-giftCard',
  templateUrl: 'gift-card.component.html',
  styleUrls: ['./gift-card.component.ng.scss'],
})
export class GiftCardComponent {
  /** Gift card node to display. */
  @Input() public giftCardNode: GiftCardNode;

  /** Whether theme is dark mode */
  public readonly isDarkTheme$: Observable<boolean> = this.theme.isDark$;

  /**
   * Gets text for card.
   * @returns { string }
   */
  get cardText(): string {
    switch (this.giftCardNode.productId) {
      case GiftCardProductIdEnum.Boost:
        return $localize`:@@GIFT_CARD__BOOST_CARD_TEXT:Boost Credits Gift`;
      case GiftCardProductIdEnum.Plus:
        return $localize`:@@GIFT_CARD__PLUS_CARD_TEXT:Minds+ Credits Gift`;
      case GiftCardProductIdEnum.Pro:
        return $localize`:@@GIFT_CARD__PRO_CARD_TEXT:Minds Pro Credits Gift`;
      case GiftCardProductIdEnum.Supermind:
        return $localize`:@@GIFT_CARD__SUPERMIND_CARD_TEXT:Supermind Credits Gift`;
      default:
        console.error(
          'Unknown gift card product displayed: ',
          this.giftCardNode
        );
        return $localize`:@@GIFT_CARD__GENERIC_CARD_TEXT:Minds Credits Gift`;
    }
  }

  constructor(private theme: ThemeService) {}
}
