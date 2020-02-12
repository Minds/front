import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent implements OnInit {
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

    this.view = null;
    this.inProgress = true;
    this.detectChanges();

    // todoojm uncomment
    // const hasMerchant = this.user && this.user.merchant.id;
    const hasMerchant = true;

    if (!hasMerchant) {
      this.view = 'onboarding';
    } else {
      await this.getAccount();

      if (this.error) {
        return;
      }

      if (!this.hasBankAccount() || this.account.verified) {
        this.view = 'bank';
      } else if (!this.account.verified && this.account.requirement) {
        this.view = 'extras';
      }
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
        // console.log('888 this account', this.account);
        // this.setView();
      })
      .catch(e => {
        this.error = e.message;
        this.view = 'error';
        this.inProgress = false;
        this.detectChanges();
      });
  }

  hasBankAccount() {
    if (this.account.requirement) {
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
