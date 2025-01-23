import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ConfigsService } from '../../../../common/services/configs.service';

export type Explorer = 'etherscan' | 'bloxy' | 'tenderly';

export type AddressType = 'wallet' | 'txid';

export type Address = {
  type: AddressType;
  id: string;
};

@Component({
  selector: 'm-admin__txExplorers',
  template: `
    <div class="m-txExplorers__container">
      <img
        (click)="onClick('etherscan')"
        [src]="this.cdnAssetsUrl + 'assets/icons/etherscan.svg'"
        class="m-txExplorers__icon"
      />
    </div>
  `,
  styleUrls: ['./transaction-explorers.component.ng.scss'],
})
export class AdminTransactionExplorersComponent {
  @Input() address: Address = null;

  public readonly cdnAssetsUrl: string;

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  public onClick(type: Explorer) {
    let url = '';

    if (!this.address.id || !this.address.type || !type) {
      console.error('A complete Address object must be passed');
      return;
    }

    switch (type) {
      case 'etherscan':
        url = `https://basescan.org/${
          this.address.type === 'txid' ? 'tx' : 'address'
        }/${this.address.id}`;
        break;
    }

    // as its occurring in onclick, forgo platform checks.
    window.open(url);
  }
}
