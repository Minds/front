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
  @Input() cashWallet: WalletCurrency; // TODOOJM handle
  @Output() accountChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() scrollToCashSettings: EventEmitter<any> = new EventEmitter<any>();

  loaded: boolean = false;
  inProgress: boolean = true;
  user;
  account;
  error: string = '';

  view: 'onboarding' | 'bank' | 'extras' | 'error';

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
    this.user = this.session.getLoggedInUser();

    this.setView();
    this.loaded = true;
    this.detectChanges();
  }

  async setView() {
    // Flow should be:
    // 1. onboarding
    // 2. bank
    // 3. (if necessary) extras
    // 4. (once verified) bank
    console.log('888 ... setting view');
    const previousView = this.view;
    // this.view = null;
    this.inProgress = true;
    this.detectChanges();

    const hasMerchant = this.user && this.user.merchant.service === 'stripe';

    if (!hasMerchant) {
      this.view = 'onboarding';
    } else {
      this.account = await this.getAccount();
      console.log('888settingscashaccount', this.account);
      if (this.error) {
        this.detectChanges();
        return;
      }

      if (!this.hasBankAccount() || this.account.verified) {
        this.view = 'bank';
      } else if (!this.account.verified && this.account.requirement) {
        this.view = 'extras';
      }
    }
    if (this.loaded && previousView === this.view && this.view !== 'error') {
      this.accountChanged.emit();
    }
    this.inProgress = false;
    this.detectChanges();
  }

  async getAccount() {
    this.inProgress = true;
    this.error = '';

    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
        this.setView();
      })
      .catch(e => {
        this.error = e.message;
        this.view = 'error';
        this.inProgress = false;
        this.detectChanges();
      });
  }

  hasBankAccount() {
    if (this.account && this.account.requirement) {
      return this.account.requirement.indexOf('external_account') === -1;
    } else {
      return true;
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
