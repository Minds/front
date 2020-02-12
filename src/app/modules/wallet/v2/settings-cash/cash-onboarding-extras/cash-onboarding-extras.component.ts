// Show this when stripe requires additional info/documents from certain users
// from certain countries/regions (e.g. Australia, NZ, Europe)
// before their accounts can be verified

import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

import { WalletDashboardService } from '../../dashboard.service';
import { Client, Upload } from '../../../../../services/api';

@Component({
  selector: 'm-walletCashOnboardingExtras',
  templateUrl: './cash-onboarding-extras.component.html',
})
export class WalletCashOnboardingExtrasComponent implements OnInit {
  @Input() account;
  @Input() allowedCountries: string[];
  @Output() submitted: EventEmitter<any> = new EventEmitter();
  inProgress: boolean;
  error: string = '';
  constructor(
    protected walletService: WalletDashboardService,
    private client: Client,
    private cd: ChangeDetectorRef,
    private upload: Upload
  ) {}

  ngOnInit() {
    // if (!this.account) {
    //   this.submitted.emit();
    //   // this.detectChanges();
    // }
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
    this.detectChanges();
    this.submitted.emit();
  }

  async updateField(fieldName: string, value: string) {
    this.inProgress = true;
    this.detectChanges();
    let body = {};
    body[fieldName] = value;
    await this.client.post('api/v2/payments/stripe/connect/update', body);
    this.inProgress = false;
    this.detectChanges();
    this.submitted.emit();
  }

  async acceptTos() {
    this.inProgress = true;
    this.detectChanges();
    await this.client.put('api/v2/payments/stripe/connect/terms');
    this.inProgress = false;
    this.detectChanges();
    this.submitted.emit();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
