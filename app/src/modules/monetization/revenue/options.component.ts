import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChartColumn } from '../../../common/components/chart/chart.component';
import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'm-revenue--options',
  templateUrl: 'options.component.html'
})
export class RevenueOptionsComponent {

  form: FormGroup;
  inProgress: boolean = true;
  editing: boolean = false;
  payoutMethod = {
    account: null,
    country: 'US'
  };
  error: string = '';
  leaving: boolean = false;
  leaveError: string = '';

  constructor(private client: Client, private cd: ChangeDetectorRef, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit() {
    this.getSettings();
    this.form = this.fb.group({
      accountNumber: ['', Validators.required],
      routingNumber: [''],
      country: ['US']
    });
  }

  getSettings() {
    this.inProgress = true;
    this.client.get('api/v1/monetization/settings')
      .then(({ bank, country }) => {
        this.inProgress = false;
        this.payoutMethod.country = country;
        this.form.controls.country.setValue(country);
        if (bank.last4) {
          this.payoutMethod.account = bank;
        }
        this.detectChanges();
      });
  }

  addBankAccount() {
    this.inProgress = true;
    this.error = '';
    this.editing = false;
    this.detectChanges();

    this.client.post('api/v1/monetization/settings', this.form.value)
      .then((response: any) => {
        this.inProgress = false;
        this.getSettings();
      })
      .catch((e) => {
        this.inProgress = false;
        this.error = e.message;
        this.detectChanges();
      });
  }

  leave() {
    this.leaving = true;
    this.detectChanges();
    this.client.delete('api/v1/monetization/settings/account')
      .then((response: any) => {
        (<any>window).Minds.user.merchant = [];
        this.router.navigate(['/newsfeed']);
      })
      .catch((e) => {
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

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
