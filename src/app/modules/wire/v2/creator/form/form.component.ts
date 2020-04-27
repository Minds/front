import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';

@Component({
  selector: 'm-wireCreator__form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'form.component.html',
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
}
