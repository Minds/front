import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';

import { Client } from '../../../../../services/api/client';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { WalletV2Service } from '../../wallet-v2.service';

/**
 * Allows users to set/update a bitcoin wallet address
 *
 * Includes validation to make sure the address is in the correct format
 *
 * See it in wallet > tokens > settings
 */
@Component({
  selector: 'm-walletSettings--btc',
  templateUrl: './settings-btc.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSettingsBTCComponent implements OnInit {
  showForm: boolean = false;
  init: boolean = false;
  inProgress: boolean = false;
  error: string;
  currentAddress: string = '';
  form;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    private toasterService: FormToastService,
    protected walletService: WalletV2Service
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      addressInput: new FormControl('', {
        validators: [this.validateAddressFormat],
      }),
    });
    this.load();
  }

  async load() {
    try {
      // Check if already has an address
      const { address } = <any>(
        await this.client.get('api/v2/wallet/btc/address')
      );
      if (address) {
        this.currentAddress = address;
      }
    } catch (e) {
      console.error(e);
    }
    this.init = true;
    this.detectChanges();
  }

  validateAddressFormat(control: AbstractControl) {
    if (control.value.length === 0) {
      return null;
    }

    // This allows for some false positives because bech32 format allows for longer length
    // but will catch some negatives so is better than nothing
    if (
      control.value.length &&
      !/^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/.test(control.value)
    ) {
      return { format: true }; // true if invalid
    }
    return null; // null if valid
  }

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
      this.currentAddress = this.addressInput.value;
      this.showForm = false;
    } catch (e) {
      this.toasterService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;

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
