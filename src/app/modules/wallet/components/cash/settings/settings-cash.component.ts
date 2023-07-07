import { Component } from '@angular/core';
import { CashWalletService } from '../cash.service';

/**
 * Container for wallet settings component - contains
 * Update Your Details button.
 */
@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent {
  constructor(protected cashService: CashWalletService) {}

  /**
   * Redirects to stripe onboarding.
   * @returns { void }
   */
  protected redirectToOnboarding(e: MouseEvent): void {
    this.cashService.redirectToOnboarding();
  }
}
