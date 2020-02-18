import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { WalletDashboardService, WalletCurrency } from '../dashboard.service';
import { Session } from '../../../../services/session';
@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent implements OnInit {
  @Output() accountChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter<any>();

  private _cashWallet: WalletCurrency;
  @Input() set cashWallet(c: WalletCurrency) {
    this._cashWallet = c;
    this.detectChanges();
    if (this.init) {
      this.setView();
    }
  }
  get cashWallet(): WalletCurrency {
    return this._cashWallet;
  }

  init: boolean = false;
  inProgress: boolean = true;
  account;
  error: string = '';

  view: string;

  allowedCountries: string[] = [
    'AT',
    'AU',
    'BE',
    'CA',
    'CH',
    'DE',
    'DK',
    'ES',
    'FI',
    'FR',
    'GB',
    'HK',
    'IE',
    'IT',
    'LU',
    'NL',
    'NO',
    'NZ',
    'PT',
    'SE',
    'SG',
    'US',
  ];

  constructor(
    protected walletService: WalletDashboardService,
    private cd: ChangeDetectorRef,
    protected session: Session
  ) {}

  ngOnInit() {
    this.setView();
    this.detectChanges();
  }

  async setView() {
    const previousView = this.view || 'onboarding';

    // const user = this.session.getLoggedInUser();
    // const hasMerchant = user && user.merchant.service === 'stripe';

    // if (!hasMerchant) {
    if (!this.cashWallet.stripeDetails.hasAccount) {
      this.view = 'onboarding';
    } else {
      await this.getAccount();

      if (
        this.cashWallet.stripeDetails.verified ||
        !this.cashWallet.stripeDetails.hasBank
      ) {
        this.view = 'bank';
      } else {
        this.view = 'extras';
      }
    }
    if (this.init && previousView !== this.view && this.view !== 'error') {
      this.accountChanged.emit();
    }
    this.inProgress = false;
    this.init = true;
    this.detectChanges();
  }

  async getAccount() {
    this.inProgress = true;
    this.error = '';

    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
        this.detectChanges();
      })
      .catch(e => {
        this.error = e.message;
        this.view = 'error';
        this.detectChanges();
      });
  }
  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
