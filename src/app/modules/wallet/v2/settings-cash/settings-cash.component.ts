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
    const previousView = this.view || 'onboarding';
    if (!this.cashWallet.stripeDetails.hasAccount) {
      this.view = 'onboarding';
    } else {
      this.inProgress = true;
      this.error = '';
      this.detectChanges();

      this.walletService
        .getStripeAccount()
        .then((account: any) => {
          this.account = account;
          if (
            !this.account.requirement ||
            this.account.requirement.indexOf('external_account') > -1
          ) {
            this.view = 'bank';
          } else {
            this.view = 'extras';
          }

          this.detectChanges();
        })
        .catch(e => {
          this.error = e.message;
          this.view = 'error';
          this.detectChanges();
        });
    }
    this.inProgress = false;
    this.detectChanges();
    if (this.init && previousView !== this.view && this.view !== 'error') {
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
