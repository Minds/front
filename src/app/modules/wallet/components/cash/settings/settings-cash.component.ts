import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Wallet,
  WalletCurrency,
  WalletV2Service,
} from '../../wallet-v2.service';
import { Session } from '../../../../../services/session';
import { CashWalletService } from '../cash.service';

/**
 * Container for forms and info related to the
 * bank account that will receive cash rewards
 *
 * See it in wallet > cash > settings
 */
@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent implements OnInit, AfterViewInit {
  @Input() embedded = false;

  cashWallet: WalletCurrency;
  cashWalletSubscription: Subscription;

  init: boolean = false;
  inProgress: boolean = false;
  account;
  error: string = '';

  view: string;

  allowedCountries: string[] = [
    'AT',
    'AU',
    'BE',
    'BG',
    // 'BR'
    'CA',
    'CH',
    'CY',
    'CZ',
    'DE',
    'DK',
    'EE',
    'ES',
    'FI',
    'FR',
    'GB',
    'GR',
    'HK',
    'HU',
    'IE',
    'IN',
    'IT',
    // 'JP'
    'LU',
    'LT',
    'LV',
    'MT',
    // 'MX',
    'MY',
    'NL',
    'NO',
    'NZ',
    'PL',
    'PT',
    'RO',
    'SE',
    'SG',
    'SI',
    'SK',
    'US',
  ];

  v2 = true;

  constructor(
    protected walletService: WalletV2Service,
    private cd: ChangeDetectorRef,
    protected session: Session,
    protected el: ElementRef,
    protected cashService: CashWalletService
  ) {}

  ngOnInit() {
    this.cashWalletSubscription = this.walletService.wallet$
      .pipe(map((wallet: Wallet) => wallet.cash))
      .subscribe((cashWallet: WalletCurrency) => {
        this.cashWallet = cashWallet;
        this.setView();
      });

    this.v2 = this.cashService.isExperimentActive();
  }

  ngOnDestroy() {
    this.cashWalletSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    // Only sub-tab where this scroll happens. Commenting out for now
    // this.el.nativeElement.scrollIntoView({
    //   behavior: 'smooth',
    // });
  }

  async setView() {
    const previousView = this.view || 'onboarding';
    if (
      !this.cashWallet.stripeDetails ||
      !this.cashWallet.stripeDetails.hasAccount
    ) {
      this.view = 'onboarding';

      if (this.session.getLoggedInUser().nsfw.length > 0) {
        this.view = 'nsfw-error';
      }
    } else {
      this.inProgress = true;
      this.error = '';
      this.detectChanges();

      try {
        this.account = this.cashWallet.stripeDetails;

        if (
          !this.account.requirement ||
          this.account.requirement.indexOf('external_account') > -1
        ) {
          this.view = 'bank';
        } else {
          this.view = 'extras';
        }

        this.detectChanges();
      } catch (e) {
        this.error = e.message;
        this.view = 'error';
        this.detectChanges();
      }
    }

    this.init = true;
    this.inProgress = false;
    this.detectChanges();
  }

  cancelStripeAccount() {
    this.walletService.cancelStripeAccount();
  }

  detectChanges(): void {
    if ((this.cd as ViewRef).destroyed) return;
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  /**
   * Redirects to stripe onboarding
   */
  redirectToOnboarding(e: MouseEvent): void {
    this.cashService.redirectToOnboarding();
  }
}
