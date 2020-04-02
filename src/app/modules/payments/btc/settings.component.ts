import {
  Component,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { Client } from '../../../services/api';
import { OverlayModalService } from '../../../services/ux/overlay-modal';

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
    private overlayModal: OverlayModalService
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
    this.overlayModal.dismiss();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
