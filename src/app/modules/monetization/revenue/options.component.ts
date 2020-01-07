import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChartColumn } from '../../../common/components/chart/chart.component';
import { Client, Upload } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-revenue--options',
  templateUrl: 'options.component.html',
})
export class RevenueOptionsComponent {
  form: FormGroup;
  inProgress: boolean = true;
  editing: boolean = false;
  payoutMethod = {
    account: null,
    country: 'US',
  };
  account;
  error: string = '';
  leaving: boolean = false;
  leaveError: string = '';

  constructor(
    private client: Client,
    private upload: Upload,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.getSettings();
    this.form = this.fb.group({
      accountNumber: ['', Validators.required],
      routingNumber: [''],
      country: ['US'],
    });
  }

  getSettings() {
    this.inProgress = true;
    this.client.get('api/v2/payments/stripe/connect').then(({ account }) => {
      this.inProgress = false;
      this.account = account;
      this.payoutMethod.country = account.country;
      this.form.controls.country.setValue(account.country);
      if (account.bankAccount.last4) {
        this.payoutMethod.account = account.bankAccount;
      }
      this.detectChanges();
    });
  }

  addBankAccount() {
    this.inProgress = true;
    this.error = '';
    // this.editing = false;
    this.detectChanges();

    this.client
      .post('api/v2/payments/stripe/connect/bank', this.form.value)
      .then((response: any) => {
        this.inProgress = false;
        this.editing = false;
        this.getSettings();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message;
        this.detectChanges();
      });
  }

  leave() {
    this.leaving = true;
    this.detectChanges();
    this.client
      .delete('api/v2/payments/stripe/connect')
      .then((response: any) => {
        (<any>window).Minds.user.merchant = [];
        this.router.navigate(['/newsfeed']);
      })
      .catch(e => {
        this.leaving = false;
        this.leaveError = e.message;
        this.detectChanges();
      });
  }

  edit() {
    this.editing = true;
    this.detectChanges();
  }

  cancelEditing() {
    this.editing = false;
    this.detectChanges();
  }

  async uploadDocument(fileInput: HTMLInputElement, documentType: string) {
    const file = fileInput ? fileInput.files[0] : null;
    this.editing = true;
    this.detectChanges();
    await this.upload.post(
      'api/v2/payments/stripe/connect/document/' + documentType,
      [file]
    );
    this.editing = false;
    this.account = null;
    this.getSettings();
  }

  async updateField(fieldName: string, value: string) {
    this.editing = true;
    this.detectChanges();
    let body = {};
    body[fieldName] = value;
    await this.client.post('api/v2/payments/stripe/connect/update', body);
    this.editing = false;
    this.account = null;
    this.getSettings();
  }

  async acceptTos() {
    this.editing = true;
    this.detectChanges();
    await this.client.put('api/v2/payments/stripe/connect/terms');
    this.editing = false;
    this.account = null;
    this.getSettings();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
