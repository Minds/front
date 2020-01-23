import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { WalletDashboardService } from '../dashboard.service';
import { FormToastService } from '../../../../common/services/form-toast.service';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'm-walletSettings--usd',
  templateUrl: './settings-usd.component.html',
})
export class WalletSettingsUSDComponent implements OnInit {
  // TODOOJM $account make this observable
  account: any;
  // TODOOJM $account make this calculated by observable
  payoutMethod = {
    account: null,
    country: 'US',
  };

  loaded: boolean = false;
  inProgress: boolean = true;
  editing: boolean = false;
  showModal: boolean = false;
  form;

  constructor(
    protected walletService: WalletDashboardService,
    private formToastService: FormToastService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getAccount();

    this.loaded = true;
    this.detectChanges();
  }

  async getAccount() {
    this.walletService
      .getStripeAccount()
      .then((account: any) => {
        this.account = account;
        this.payoutMethod.country = account.country;
        this.form.controls.country.setValue(account.country);
        if (account.bankAccount.last4) {
          this.payoutMethod.account = account.bankAccount;
        }
      })
      .catch(e => {
        this.formToastService.error(e.message);
        // this.detectChanges();
      });

    this.form = new FormGroup({
      accountNumber: new FormControl('', {
        validators: [Validators.required],
      }),
      routingNumber: new FormControl(''),
      country: new FormControl('US'),
    });

    this.loaded = true;
    this.detectChanges();
  }

  async createaccount() {}

  async addBank() {
    this.inProgress = true;
    this.detectChanges();

    this.walletService
      .addStripeBank(this.form.value)
      .then((response: any) => {
        this.inProgress = false;
        this.editing = false;
        this.formToastService.success(
          'Your bank account was successfully added.'
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
        (<any>window).Minds.user.merchant = [];
        this.getAccount();
      })
      .catch(e => {
        this.formToastService.error(e.message);
      });
    this.detectChanges();
  }

  edit() {
    this.editing = true;
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

  get accountNumber() {
    return this.form.get('accountNumber');
  }
  get routingNumber() {
    return this.form.get('routingNumber');
  }
  get country() {
    return this.form.get('country');
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
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
