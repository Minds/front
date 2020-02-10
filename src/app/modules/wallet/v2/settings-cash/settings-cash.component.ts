import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { requiredFor, optionalFor } from './settings-cash.validators';

@Component({
  selector: 'm-walletSettings--cash',
  templateUrl: './settings-cash.component.html',
})
export class WalletSettingsCashComponent implements OnInit {
  loaded: boolean = false;
  inProgress: boolean = true;

  //  TODOOJM uncomment after form is done
  // editingAccount: boolean = false;
  editingAccount: boolean = true;
  editingBank: boolean = false;

  account: any;
  hasBankAccount: boolean = false;

  showModal: boolean = false;
  modalContent: string = 'leaveMonetization' || 'removeBank';

  user;
  // restrictAsVerified: boolean = false;
  error: string = '';

  accountForm;
  bankForm;
  stripeAgreeForm;

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

  localLabels: any = {
    HK: {
      accountNumber: '',
      routingNumber: '',
      tooltip: '',
    },
  };

  constructor(
    protected walletService: WalletDashboardService,
    private formToastService: FormToastService,
    private cd: ChangeDetectorRef,
    protected session: Session,
    private configs: ConfigsService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.user = this.session.getLoggedInUser();
    if (this.isMonetized()) {
      this.getAccount();
    }

    this.accountForm = this.fb.group({
      country: ['US', Validators.required],

      firstName: ['', optionalFor(['JP'])],
      lastName: ['', optionalFor(['JP'])],
      gender: ['', requiredFor(['JP'])],
      dob: ['', Validators.required],
      phoneNumber: ['', requiredFor(['JP'])],
      ssn: ['', requiredFor(['US'])],
      personalIdNumber: ['', requiredFor(['CA', 'HK', 'SG'])],

      street: ['', optionalFor(['JP'])],
      city: ['', optionalFor(['JP', 'SG'])],
      state: ['', requiredFor(['AU', 'CA', 'IE', 'US'])],
      postCode: ['', optionalFor(['HK', 'IE', 'JP'])],
    });

    this.bankForm = this.fb.group({
      bankCountry: ['US', Validators.required],
      accountNumber: ['', Validators.required],
      routingNumber: ['', requiredFor(['US'])],
    });

    this.stripeAgreeForm = this.fb.group({
      stripeAgree: ['', Validators.required],
    });

    this.loaded = true;
    this.detectChanges();
  }

  async getAccount() {
    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
        console.log('account', this.account);
        this.bankCountry.patchValue(account.bankAccount.country);

        this.country.setValue(account.country);
        if (account.bankAccount.last4) {
          this.hasBankAccount = true;
        }
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });

    this.detectChanges();
  }

  async createAccount() {
    this.inProgress = true;
    this.error = '';

    const accountFormVal = this.accountForm.value;
    accountFormVal.stripeAgree = this.stripeAgree.value;
    console.log('accountFormVal w/ agree', accountFormVal);
    this.walletService
      .createStripeAccount(accountFormVal)
      .then((response: any) => {
        console.log('createAccount response', response);
        this.inProgress = false;

        // Is this kind of stuff necessary anymore?
        if (!this.user.programs) {
          this.user.programs = [];
        }
        this.user.programs.push('affiliate');

        this.user.merchant = {
          id: response.id,
          service: 'stripe',
          status: 'awaiting-document',
          exclusive: {
            enabled: true,
            amount: 10,
          },
        };
        this.addBank();
      })
      .catch(e => {
        this.inProgress = false;
        this.error = e.message;
      });

    this.detectChanges();
  }

  async addBank() {
    const bankFormVal = this.bankForm.value;
    bankFormVal.country = bankFormVal.bankCountry;
    delete bankFormVal.bankCountry;

    console.log('new bankFormVal', bankFormVal);

    this.walletService
      .addStripeBank(bankFormVal)
      .then((response: any) => {
        this.editingBank = false;

        const toasterMessage = this.isMonetized()
          ? 'Your bank account has been successfully updated'
          : 'Your request to join the monetization program has been submitted';
        this.formToastService.success(toasterMessage);
        this.getAccount();
      })
      .catch(e => {
        this.error = e.message;
      });
    this.inProgress = false;
    this.detectChanges();
  }

  enterEditAccountMode(bool) {
    this.editingBank = false;
    this.editingAccount = bool;
    this.detectChanges();
  }
  enterEditBankMode(bool) {
    this.editingAccount = false;
    this.editingBank = bool;
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
        this.getAccount();
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });
    this.detectChanges();
  }

  isCountry(countries: string[]) {
    return countries.indexOf(this.country.value) > -1;
  }
  isMonetized() {
    // TODOOJM uncomment after form is done
    // if (this.user && this.user.merchant.id) {
    //   return true;
    // }
    return false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get country() {
    return this.accountForm.get('country');
  }
  get firstName() {
    return this.accountForm.get('firstName');
  }
  get lastName() {
    return this.accountForm.get('lastName');
  }
  get gender() {
    return this.accountForm.get('gender');
  }
  get dob() {
    return this.accountForm.get('dob');
  }
  get phoneNumber() {
    return this.accountForm.get('phoneNumber');
  }
  get ssn() {
    return this.accountForm.get('ssn');
  }
  get personalIdNumber() {
    return this.accountForm.get('personalIdNumber');
  }
  get street() {
    return this.accountForm.get('street');
  }
  get city() {
    return this.accountForm.get('city');
  }
  get state() {
    return this.accountForm.get('state');
  }
  get postCode() {
    return this.accountForm.get('postCode');
  }
  get stripeAgree() {
    return this.accountForm.get('stripeAgree');
  }
  get accountNumber() {
    return this.bankForm.get('accountNumber');
  }
  get routingNumber() {
    return this.bankForm.get('routingNumber');
  }
  get bankCountry() {
    return this.bankForm.get('bankCountry');
  }
}

// export class RevenueOptionsComponent {
//   form: FormGroup;
//   inProgress: boolean = true;
//   editing: boolean = false;
//   payoutMethod = {
//     account: null,
//     country: 'US',
//   };
//   account;
//   error: string = '';
//   leaving: boolean = false;
//   leaveError: string = '';

//   constructor(
//     private client: Client,
//     private upload: Upload,
//     private cd: ChangeDetectorRef,
//     private fb: FormBuilder,
//     private router: Router
//   ) {}

//   ngOnInit() {
//     this.getSettings();
//     this.form = this.fb.group({
//       accountNumber: ['', Validators.required],
//       routingNumber: [''],
//       country: ['US'],
//     });
//   }

//   getSettings() {
//     this.inProgress = true;
//     this.client.get('api/v2/payments/stripe/connect').then(({ account }) => {
//       this.inProgress = false;
//       this.account = account;
//       this.payoutMethod.country = account.country;
//       this.form.controls.country.setValue(account.country);
//       if (account.bankAccount.last4) {
//         this.payoutMethod.account = account.bankAccount;
//       }
//       this.detectChanges();
//     });
//   }

//   addBank() {
//     this.inProgress = true;
//     this.error = '';
//     // this.editing = false;
//     this.detectChanges();

//     this.client
//       .post('api/v2/payments/stripe/connect/bank', this.form.value)
//       .then((response: any) => {
//         this.inProgress = false;
//         this.editing = false;
//         this.getSettings();
//       })
//       .catch(e => {
//         this.inProgress = false;
//         this.error = e.message;
//         this.detectChanges();
//       });
//   }

//   leave() {
//     this.leaving = true;
//     this.detectChanges();
//     this.client
//       .delete('api/v2/payments/stripe/connect')
//       .then((response: any) => {
//         (<any>window).Minds.user.merchant = [];
//         this.router.navigate(['/newsfeed']);
//       })
//       .catch(e => {
//         this.leaving = false;
//         this.leaveError = e.message;
//         this.detectChanges();
//       });
//   }

//   edit() {
//     this.editing = true;
//     this.detectChanges();
//   }

//   cancelEditing() {
//     this.editing = false;
//     this.detectChanges();
//   }

//   async uploadDocument(fileInput: HTMLInputElement, documentType: string) {
//     const file = fileInput ? fileInput.files[0] : null;
//     this.editing = true;
//     this.detectChanges();
//     await this.upload.post(
//       'api/v2/payments/stripe/connect/document/' + documentType,
//       [file]
//     );
//     this.editing = false;
//     this.account = null;
//     this.getSettings();
//   }

//   async updateField(fieldName: string, value: string) {
//     this.editing = true;
//     this.detectChanges();
//     let body = {};
//     body[fieldName] = value;
//     await this.client.post('api/v2/payments/stripe/connect/update', body);
//     this.editing = false;
//     this.account = null;
//     this.getSettings();
//   }

//   async acceptTos() {
//     this.editing = true;
//     this.detectChanges();
//     await this.client.put('api/v2/payments/stripe/connect/terms');
//     this.editing = false;
//     this.account = null;
//     this.getSettings();
//   }

//   detectChanges() {
//     this.cd.markForCheck();
//     this.cd.detectChanges();
//   }
// }
