import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { requiredFor, optionalFor } from './../settings-cash.validators';
import { WalletDashboardService } from '../../dashboard.service';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import localLabels from './local-labels';

@Component({
  selector: 'm-walletBankForm',
  templateUrl: './bank-form.component.html',
})
export class WalletBankFormComponent implements OnInit {
  @Input() allowedCountries: string[];
  account;
  form;

  loaded: boolean = false;
  inProgress: boolean = false;
  editing: boolean = false;
  showModal: boolean = false;
  modalContent: 'leaveEditMode' | 'leaveMonetization' | 'removeBank';
  leftMonetization: boolean = false;

  initCountry: string;

  constructor(
    private cd: ChangeDetectorRef,
    protected walletService: WalletDashboardService,
    private fb: FormBuilder,
    private formToastService: FormToastService,
    private configs: ConfigsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      country: ['', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', requiredFor(['US'])],
    });
    this.getAccount();
  }

  async getAccount() {
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
        this.initCountry = account.bankAccount.country || account.country;
        this.country.patchValue(this.initCountry);

        this.country.setValue(account.country);
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });
    this.loaded = true;
    this.inProgress = false;
    this.detectChanges();
  }
  async removeBank() {
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .removeStripeBank()
      .then((response: any) => {
        this.inProgress = false;
        this.formToastService.success(
          'Your bank account was successfully removed.'
        );
        this.getAccount();
      })
      .catch(e => {
        this.inProgress = false;
        this.formToastService.error(e.message);
      });
    this.detectChanges();
  }

  async leaveMonetization() {
    this.showModal = false;
    this.detectChanges();
    this.walletService
      .leaveMonetization()
      .then((response: any) => {
        this.configs.set('merchant', []);
        // this.getAccount();
        this.leftMonetization = true;
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });
    this.detectChanges();
  }

  async addBank() {
    this.walletService
      .addStripeBank(this.form.value)
      .then((response: any) => {
        this.editing = false;

        const toasterMessage = this.isMonetized()
          ? 'Your bank account has been successfully updated'
          : 'Your request to join the monetization program has been submitted';
        this.formToastService.success(toasterMessage);

        this.getAccount();
        // if(filling out form for the first time){
        // emit 'pending' to parent
        // } else emit 'hasAccount' to parent
      })
      .catch(e => {
        // this.error = e.message;
        // todoojm - error handling
      });
    this.inProgress = false;
    this.detectChanges();
  }

  enterEditMode() {
    // TODOOJM see if this is necessary by checking what value country goes to after form.reset
    this.country.patchValue(this.initCountry);

    this.editing = true;
    this.detectChanges();
  }

  leaveEditMode() {
    this.editing = false;
    this.form.reset();
    this.detectChanges();
  }

  isCountry(countries: string[]) {
    return countries.indexOf(this.country.value) > -1;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  isMonetized() {
    // TODOOJM uncomment after form is done
    // if (this.user && this.user.merchant.id) {
    //   return true;
    // }
    return false;
  }

  get accountNumber() {
    return this.form.get('accountNumber');
  }
  get routingNumber() {
    return this.form.get('routingNumber');
  }
  get country() {
    return this.form.get('country');
  }
}
