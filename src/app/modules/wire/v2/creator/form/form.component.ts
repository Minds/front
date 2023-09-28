import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WireType, WireV2Service } from '../../wire-v2.service';
import { GiftCardProductIdEnum } from '../../../../../../graphql/generated.engine';

/**
 * Used in the tip modal to collect information about a payment
 * (e.g. amount, which bank account/wallet, whether it is recurring)
 *
 * Includes tabs for different currencies (tokens/usd).
 *
 */
@Component({
  selector: 'm-wireCreator__form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form.component.html',
  styleUrls: ['form.component.ng.scss'],
})
export class WireCreatorFormComponent {
  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service) {}

  /**
   * Sanitizes and sets the payment amount
   * @param amount
   */
  setAmount(amount: string): void {
    amount = amount.trim();

    if (amount.slice(-1) === '.') {
      // If we're in the middle of writing a decimal value, don't process it
      return;
    }

    const numericAmount = parseFloat(amount.replace(/,/g, '') || '0');

    if (isNaN(numericAmount)) {
      return;
    }

    // TODO: Remove non-digits properly to avoid NaN
    this.service.setAmount(numericAmount);
  }

  /**
   * Sets the type of the wire service and the default amount.
   * @param { WireType } the currency e.g. 'eth', 'btc'.
   * @returns { void }
   */
  public setType(type: WireType): void {
    if (type === 'eth' || type === 'btc') {
      this.service.amount$.next(0.01);
    } else {
      this.service.amount$.next(1);
    }
    this.service.setType(type);
  }

  /**
   * Gets gift card product ID applicable to the current upgrade type.
   * If no matching upgrade type is found, will return null.
   * @returns { GiftCardProductIdEnum } applicable gift card product id.
   */
  public getApplicableGiftCardProductId(): GiftCardProductIdEnum {
    // We don't want to show a gift card for gift card purchases.
    return !this.service.isSendingGift$.getValue()
      ? this.service.getApplicableGiftCardProductId()
      : null;
  }
}
