import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
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

  view:
    | 'onboardingForm'
    | 'additionalReqtsForm'
    | 'bankForm'
    | 'pendingApproval'
    | 'error';

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
    private formToastService: FormToastService,
    private cd: ChangeDetectorRef,
    protected session: Session
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();

    this.setFormView();

    this.loaded = true;
    this.inProgress = false;
    this.detectChanges();
  }

  setFormView() {
    this.inProgress = true;
    this.detectChanges();

    const hasMerchant = this.user && this.user.merchant.id;

    if (!hasMerchant) {
      this.view = 'onboardingForm';
    } else {
      this.getAccount();
      if (this.error) {
        return;
      }
      // if pending (???) pending; return

      // if additional reqts, additinoalReqts
      // else bankForm
    }
  }

  async getAccount() {
    this.error = '';
    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;

        // TODOOJM handle view selection
        // if (!this.account.bankAccount || !this.account.bankAccount.last4) {
        //   this.view = 'bankForm';
        // } else {
        // }
      })
      .catch(e => {
        this.error = e.message;
        this.view = 'error';
      });

    this.inProgress = false;
    this.detectChanges();
  }

  switchView(view) {
    this.view = view;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
