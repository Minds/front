import {
  Component,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { WalletV2Service } from '../../../wallet-v2.service';
import { Client, Upload } from '../../../../../../services/api';

/**
 * Show this form when Stripe requires additional info/documents from certain users from certain countries/regions
 * (e.g Australia, NZ, Europe) before their accounts can be verified (and monetized).
 * Not used for every country.
 */
@Component({
  selector: 'm-walletCashOnboardingExtras',
  templateUrl: './cash-onboarding-extras.component.html',
})
export class WalletCashOnboardingExtrasComponent {
  @Input() account;
  @Input() allowedCountries: string[];
  @Output() submitted: EventEmitter<any> = new EventEmitter();
  inProgress: boolean;
  error: string = '';
  constructor(
    protected walletService: WalletV2Service,
    private client: Client,
    private cd: ChangeDetectorRef,
    private upload: Upload
  ) {}

  async uploadDocument(fileInput: HTMLInputElement, documentType: string) {
    const file = fileInput ? fileInput.files[0] : null;
    this.inProgress = true;
    this.detectChanges();
    const response: any = await this.upload.post(
      'api/v2/payments/stripe/connect/document/' + documentType,
      [file]
    );
    this.handleResponse(response);
  }

  async updateField(fieldName: string, value: string) {
    this.inProgress = true;
    this.detectChanges();
    let body = {};
    body[fieldName] = value;
    const response: any = await this.client.post(
      'api/v2/payments/stripe/connect/update',
      body
    );
    this.handleResponse(response);
  }

  async acceptTos() {
    this.inProgress = true;
    this.detectChanges();
    const response: any = await this.client.put(
      'api/v2/payments/stripe/connect/terms'
    );
    this.handleResponse(response);
  }

  handleResponse(response) {
    if (response.status === 'error') {
      this.error = response.message;
      this.inProgress = false;
      this.detectChanges();
    } else {
      this.submitted.emit();
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
