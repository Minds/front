import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Input,
  ViewRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { WalletV2Service, WalletCurrency } from '../../wallet-v2.service';
import { Session } from '../../../../../services/session';
@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent implements OnInit, AfterViewInit {
  @Output() accountChanged: EventEmitter<any> = new EventEmitter<any>();

  cashWallet: WalletCurrency;

  init: boolean = false;
  inProgress: boolean = false;
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
    protected walletService: WalletV2Service,
    private cd: ChangeDetectorRef,
    protected session: Session,
    protected el: ElementRef
  ) {}

  ngOnInit() {
    this.cashWallet = this.walletService.wallet.cash;
    this.setView();
    this.init = true;
    this.detectChanges();
  }

  ngAfterViewInit() {
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  async setView() {
    const previousView = this.view || 'onboarding';
    if (
      !this.cashWallet.stripeDetails ||
      !this.cashWallet.stripeDetails.hasAccount
    ) {
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

  detectChanges(): void {
    if (!(this.cd as ViewRef).destroyed) {
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
