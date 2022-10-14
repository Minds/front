import { Component, Input, OnDestroy, OnInit, SkipSelf } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { CashWalletService } from '../../../modules/wallet/components/cash/cash.service';
import {
  Wallet,
  WalletCurrency,
  WalletV2Service,
} from '../../../modules/wallet/components/wallet-v2.service';
import { ToasterService } from '../../services/toaster.service';
import { ButtonComponent } from '../button/button.component';

/**
 * Prompt / banner intended for display in main content pane, indicating that a user
 * needs to connect their bank account when one is not connected.
 */
@Component({
  selector: 'm-addBankPrompt',
  templateUrl: './add-bank-prompt.component.html',
  styleUrls: ['add-bank-prompt.component.ng.scss'],
})
export class AddBankPromptComponent {
  // cash wallet
  public cashWallet: WalletCurrency;

  // whether user has an account
  public hasAccount: boolean = false;

  // whether user had a bank
  public hasBank: boolean = false;

  // should a loading spinner be shown while loading
  @Input() showLoadingSpinner: boolean = false;

  isLoading$$ = this.cashService.isLoading$$;

  /** @inheritDoc */
  hasAccount$ = this.cashService.hasAccount$;

  /** @inheritDoc */
  isRestricted$ = this.cashService.isRestricted$;

  /** @inheritDoc */
  restrictedReason$ = this.cashService.restrictedReason$;

  constructor(
    protected cashService: CashWalletService,
    protected toasterService: ToasterService
  ) {}

  /**
   * Will call the api to create an account
   */
  async createAccount(e: MouseEvent, btn: ButtonComponent) {
    try {
      btn.saving = true;

      await this.cashService.createAccount();

      // Now redirect to onboarding
      this.redirectToOnboarding(e);
    } catch (err) {
      this.toasterService.error(err.error.message);
      btn.saving = false; // only stop saving state on error, as we want saving state to follow through to redirect
    }
  }

  /**
   * Takes the user to stripe connect onboarding screen
   */
  redirectToOnboarding(e: MouseEvent) {
    this.cashService.redirectToOnboarding();
  }
}
