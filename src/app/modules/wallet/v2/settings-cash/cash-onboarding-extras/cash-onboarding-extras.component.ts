// Show this when stripe requires additional info/documents from certain users
// from certain countries/regions (e.g. Australia, NZ, Europe)
// before their accounts can be verified

import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { WalletDashboardService } from '../../dashboard.service';
import { Client, Upload } from '../../../../../services/api';

@Component({
  selector: 'm-walletCashOnboardingExtras',
  templateUrl: './cash-onboarding-extras.component.html',
})
export class WalletCashOnboardingExtrasComponent implements OnInit {
  loaded: boolean = false;
  inProgress: boolean = true;
  account;
  error: string = '';
  constructor(
    protected walletService: WalletDashboardService,
    private client: Client,
    private cd: ChangeDetectorRef,
    private upload: Upload
  ) {}

  ngOnInit() {
    this.getAccount();
  }

  async getAccount() {
    this.error = '';
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
      })
      .catch(e => {
        this.error = e.message;
      });

    this.inProgress = false;
    this.detectChanges();
  }

  async uploadDocument(fileInput: HTMLInputElement, documentType: string) {
    const file = fileInput ? fileInput.files[0] : null;
    this.inProgress = true;
    this.detectChanges();
    await this.upload.post(
      'api/v2/payments/stripe/connect/document/' + documentType,
      [file]
    );
    this.inProgress = false;
    this.account = null;
    this.getAccount();
  }

  async updateField(fieldName: string, value: string) {
    this.inProgress = true;
    this.detectChanges();
    let body = {};
    body[fieldName] = value;
    await this.client.post('api/v2/payments/stripe/connect/update', body);
    this.inProgress = false;
    this.account = null;
    this.getAccount();
  }

  async acceptTos() {
    this.inProgress = true;
    this.detectChanges();
    await this.client.put('api/v2/payments/stripe/connect/terms');
    this.inProgress = false;
    this.account = null;
    this.getAccount();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
