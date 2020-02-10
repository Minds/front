import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { LocalWalletService } from '../../../../blockchain/local-wallet.service';
import { BlockchainService } from '../../../../blockchain/blockchain.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { getBrowser } from '../../../../../utils/browser';
import { ConfigsService } from '../../../../../common/services/configs.service';

enum Views {
  CreateAddress = 1,
  ProvideAddress,
  UseExternal,
}

@Component({
  selector: 'm-token--onboarding--onchain',
  templateUrl: 'onchain.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenOnChainOnboardingComponent {
  readonly cdnAssetsUrl: string;
  @Input() skippable: boolean = true;
  @Output() next: EventEmitter<any> = new EventEmitter();
  inProgress: boolean = false;
  error: string;
  display: Views;
  generatedAccount: any;
  providedAddress: string = '';
  hasExternal: boolean = false;
  downloadingMetamask: boolean = false;

  readonly Views = Views;

  private _externalTimer;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    protected localWallet: LocalWalletService,
    protected blockchain: BlockchainService,
    protected web3Wallet: Web3WalletService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    //already completed step
    if (this.session.getLoggedInUser().eth_wallet) {
      this.next.next();
      return;
    }

    this.checkExternal();
  }

  ngOnDestroy() {
    if (this._externalTimer) {
      clearInterval(this._externalTimer);
    }
  }

  async checkExternal() {
    this.hasExternal = !(await this.web3Wallet.isLocal());
    this.detectChanges();
  }

  async createAddress() {
    try {
      this.inProgress = true;
      this.detectChanges();

      this.generatedAccount = await this.localWallet.create(false);
      await this.blockchain.setWallet({
        address: this.generatedAccount.address,
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  async downloadPrivateKey() {
    try {
      this.inProgress = true;
      this.detectChanges();

      const { address, privateKey } = this.generatedAccount,
        filename = `pk_${address}.csv`,
        blob = new Blob([privateKey], { type: 'text/csv' });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        const link = window.document.createElement('a'),
          objectUrl = window.URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
          this.generatedAccount = null;
          this.next.next();
        }, 1000);
      }
    } catch (e) {
      console.error(e);
      this.inProgress = false;
    }
  }

  canProvideAddress() {
    return (
      this.providedAddress && /^0x[a-fA-F0-9]{40}$/.test(this.providedAddress)
    );
  }

  async provideAddress() {
    if (!this.canProvideAddress() || this.inProgress) {
      return;
    }

    try {
      this.inProgress = true;
      this.detectChanges();

      await this.blockchain.setWallet({ address: this.providedAddress });
      this.next.next();
    } catch (e) {
      console.error(e);
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  downloadMetamask() {
    let browser: string = getBrowser();
    let url = '';
    switch (browser) {
      case 'chrome':
        url =
          'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn';
      case 'firefox':
        url = 'https://addons.mozilla.org/firefox/addon/ether-metamask/';
      case 'opera':
        url = 'https://addons.opera.com/extensions/details/metamask/';
      default:
        url = 'https://metamask.io';
    }
    window.open(url);
    this.downloadingMetamask = true;
  }

  async useExternal() {
    await this.web3Wallet.ready();

    this.detectExternal();

    this._externalTimer = setInterval(() => {
      this.detectExternal();
    }, 1000);
  }

  async detectExternal() {
    const address: string =
      (await this.web3Wallet.getCurrentWallet(true)) || '';

    if (this.providedAddress !== address) {
      this.providedAddress = address;
      this.detectChanges();

      if (this.providedAddress) {
        clearInterval(this._externalTimer);
        this.provideAddress();
      }
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
