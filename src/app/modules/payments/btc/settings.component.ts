import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Client } from '../../../services/api';
import { ModalService } from '../../../services/ux/modal.service';

@Component({
  selector: 'm-btc__settings',
  templateUrl: 'settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BTCSettingsComponent {
  btcAddress: string = '';
  saving: boolean = false;

  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getAddressFromRemote();
  }

  async getAddressFromRemote() {
    const { address } = <any>await this.client.get('api/v2/wallet/btc/address');
    this.btcAddress = address;
    this.detectChanges();
  }

  async save() {
    this.saving = true;
    await this.client.post('api/v2/wallet/btc/address', {
      address: this.btcAddress,
    });
    this.saving = false;
    this.detectChanges();
    this.modalService.dismissAll();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
