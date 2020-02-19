import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  ViewRef,
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
    console.log('SettingsCash.ts : wallet input has been updated');
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
    this.init = true;
    this.detectChanges();
  }

  async setView() {
    console.log('setting cashSettings view_________');
    const previousView = this.view || 'onboarding';

    // const user = this.session.getLoggedInUser();
    // const hasMerchant = user && user.merchant.service === 'stripe';

    // if (!hasMerchant) {
    if (!this.cashWallet.stripeDetails.hasAccount) {
      console.log('view is: onboarding');
      this.view = 'onboarding';
    } else {
      this.inProgress = true;
      this.error = '';
      this.detectChanges();

      this.walletService
        .getStripeAccount()
        .then((account: any) => {
          console.log('cashSettings getStripeAccount response', account);
          this.account = account;
          if (
            !this.account.requirement ||
            this.account.requirement.indexOf('external_account') > -1
          ) {
            console.log('view is: bank');
            this.view = 'bank';
          } else {
            console.log('view is: extras');
            this.view = 'extras';
          }

          this.detectChanges();
        })
        .catch(e => {
          this.error = e.message;
          this.view = 'error';
          console.log('view is: error');
          this.detectChanges();
        });
    }
    this.inProgress = false;
    this.detectChanges();
    if (this.init && previousView !== this.view && this.view !== 'error') {
      console.log('**Event Emitter: accountChanged');
      this.accountChanged.emit();
    }
  }

  detectChanges() {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
