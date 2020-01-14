import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { Client } from '../../../../services/api/client';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { WalletDashboardService } from '../dashboard.service';
@Component({
  selector: 'm-walletSettings--btc',
  templateUrl: './settings-btc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSettingsBTCComponent implements OnInit {
  @Output() addressSetupComplete: EventEmitter<any> = new EventEmitter();
  showForm: boolean = false;
  inProgress: boolean = false;

  error: string;
  currentAddress: string = '';
  form;
  minds = window.Minds;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private formToastService: FormToastService,
    protected walletService: WalletDashboardService
  ) {}

  ngOnInit() {
    this.load();
  }
  async load() {
    // Check if already has an address
    const { address } = <any>await this.client.get('api/v2/wallet/btc/address');
    this.currentAddress = address;

    this.form = new FormGroup({
      addressInput: new FormControl(this.currentAddress, {
        validators: [Validators.required, this.validateAddressFormat],
      }),
    });

    this.detectChanges();
  }

  validateAddressFormat(control: AbstractControl) {
    if (
      control.value.length &&
      !/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(control.value)
    ) {
      return { format: true }; // true if invalid
    }
    return null; // null if valid
  }

  // isAddressFormatValid() {
  //   const isAddressValid =
  //     this.providedAddress && /^0x[a-fA-F0-9]{40}$/.test(this.providedAddress);
  //   if (!isAddressValid) {
  //     // this.formToastService.error('Invalid address format.');
  //   }
  //   return isAddressValid;
  // }

  async provideAddress() {
    if (this.form.invalid || this.inProgress) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.client.post('api/v2/wallet/btc/address', {
        address: this.addressInput.value,
      });
      this.addressSetupComplete.emit();
    } catch (e) {
      // TODOOJM get rid of form toast
      this.formToastService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;
      this.currentAddress = this.addressInput.value;
      this.detectChanges();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
  get addressInput() {
    return this.form.get('addressInput');
  }
}
