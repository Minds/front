import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewRef,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { LocalWalletService } from '../../../../blockchain/local-wallet.service';
import { BlockchainService } from '../../../../blockchain/blockchain.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { getBrowser } from '../../../../../utils/browser';
import { WalletV2Service, Wallet } from '../../wallet-v2.service';
import { Subscription } from 'rxjs';
import { ethers } from 'ethers';
import { FormToastService } from '../../../../../common/services/form-toast.service';

enum Views {
  CreateAddress = 1,
  ProvideAddress,
  CurrentAddress,
}

@Component({
  selector: 'm-walletSettings--tokens',
  templateUrl: './settings-tokens.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletSettingsTokensComponent
  implements OnInit, OnDestroy, AfterViewInit {
  inProgress: boolean = false;
  wallet: Wallet;
  walletSubscription: Subscription;

  linkingMetamask: boolean = false;
  error: string = '';
  display: Views;
  generatedAccount: any;
  providedAddress: string = '';
  hasExternal: boolean = true;
  currentAddress: string = '';
  downloadingMetamask: boolean = false;
  form;
  isVerified: boolean;

  readonly cdnAssetsUrl: string;

  readonly Views = Views;

  private _externalTimer;
  private _downloadTimer;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    protected localWallet: LocalWalletService,
    protected blockchain: BlockchainService,
    protected web3Wallet: Web3WalletService,
    protected walletService: WalletV2Service,
    configs: ConfigsService,
    protected el: ElementRef,
    @Inject(PLATFORM_ID) protected platformId: Object,
    protected toasterService: FormToastService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.form = new FormGroup({
      addressInput: new FormControl('', {
        validators: [Validators.required, this.validateAddressFormat],
      }),
    });
    this.walletSubscription = this.walletService.wallet$.subscribe(
      (wallet: Wallet) => {
        this.wallet = wallet;
        this.currentAddress = this.walletService.wallet.receiver.address;

        if (this.currentAddress) {
          this.display = Views.CurrentAddress;
          this.detectChanges();
        }
      }
    );

    this.load();
  }

  ngAfterViewInit() {
    this.el.nativeElement.scrollIntoView({
      behavior: 'smooth',
    });
  }

  async load() {
    // Check if already has an address
    this.currentAddress = this.walletService.wallet.receiver.address;

    this.isVerified = await this.walletService.isVerified();
    console.log(this.isVerified);

    if (this.currentAddress) {
      this.display = Views.CurrentAddress;
      this.detectChanges();
    }

    this.detectChanges();
  }

  async createAddress() {
    this.error = '';
    try {
      this.inProgress = true;
      this.detectChanges();

      this.generatedAccount = await this.localWallet.create(false);
      await this.blockchain.setWallet({
        address: this.generatedAccount.address,
      });
      this.currentAddress = this.generatedAccount.address;
    } catch (e) {
      console.error(e);
      this.error = e.message;
    } finally {
      this.inProgress = false;
      this.detectChanges();
    }
  }

  async downloadPrivateKey() {
    this.error = '';
    try {
      this.inProgress = true;
      this.detectChanges();

      const { address, privateKey } = this.generatedAccount,
        filename = `pk_${address}.csv`,
        blob = new Blob([privateKey], { type: 'text/csv' });

      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
        this.inProgress = false;
        this.walletService.onOnchainAddressChange();
        this.detectChanges();
      } else {
        const link = window.document.createElement('a'),
          objectUrl = window.URL.createObjectURL(blob);

        link.href = objectUrl;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (isPlatformBrowser(this.platformId)) {
          this._downloadTimer = setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            this.generatedAccount = null;
            this.walletService.onOnchainAddressChange();
            this.inProgress = false;
            if (!(this.cd as ViewRef).destroyed) {
              this.detectChanges();
            }
          }, 1000);
        }
      }
      this.display = Views.CurrentAddress;
    } catch (e) {
      console.error(e);
      this.error = e.message;
      this.inProgress = false;
    }
  }

  validateAddressFormat(control: AbstractControl) {
    if (control.value.length && !/^0x[a-fA-F0-9]{40}$/.test(control.value)) {
      return { format: true }; // true if invalid
    }
    return null; // null if valid
  }

  async provideAddress() {
    this.error = '';
    if (this.form.invalid || this.inProgress) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.blockchain.setWallet({ address: this.addressInput.value });
      this.walletService.onOnchainAddressChange();

      this.currentAddress = this.addressInput.value;
      this.display = Views.CurrentAddress;
    } catch (e) {
      console.error(e);
      this.error = e.message;
    } finally {
      this.inProgress = false;
      this.linkingMetamask = false;
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
    if (this.inProgress || this.linkingMetamask) {
      return;
    }
    this.error = '';
    this.linkingMetamask = true;
    this.inProgress = true;
    this.detectChanges();
    await this.detectExternal();
  }

  async detectExternal() {
    this.error = '';
    let address: string;

    try {
      address = (await this.web3Wallet.getCurrentWallet(true)) || '';

      await this.blockchain.setWallet({ address: address });

      this.currentAddress = address;
      this.display = Views.CurrentAddress;
      this.walletService.onOnchainAddressChange();
    } catch (e) {
      this.error = e.message;
    } finally {
      this.inProgress = false;
      this.linkingMetamask = false;

      this.detectChanges();
    }

    if (this.providedAddress !== address) {
      this.providedAddress = address;
      this.currentAddress = address;
      this.detectChanges();
    }
  }

  backToCurrentAddress(): void {
    if (isPlatformBrowser(this.platformId)) {
      clearInterval(this._externalTimer);
      this.detectChanges();
    }
    this.inProgress = false;
    this.linkingMetamask = false;

    this.display = this.Views.CurrentAddress;
    this.detectChanges();
  }

  changeProvider() {
    this.display = null;
    this.web3Wallet.resetProvider();
  }

  async validate(): Promise<void> {
    this.isVerified = undefined;

    await this.web3Wallet.getCurrentWallet(true);

    const msg = JSON.stringify({
      user_guid: this.session.getLoggedInUser().guid,
      unix_ts: Math.round(Date.now() / 1000),
    });

    // Non-metamask wallet require hashed byte messages, for some unknown reason
    const msgHash = ethers.utils.hashMessage(msg);
    const msgHashBytes = ethers.utils.arrayify(msgHash);

    // Non-metamask wallets will only have correct signature if msgHashBytes are used.
    const msgToSign =
      this.web3Wallet.getSigner().provider.connection.url === 'metamask'
        ? msg
        : msgHashBytes;

    const signature = await this.web3Wallet.getSigner().signMessage(msgToSign);

    try {
      const response = await (<any>this.client.post(
        'api/v3/blockchain/unique-onchain/validate',
        {
          signature,
          payload: msg,
          address: this.currentAddress,
        }
      ));

      if (response.status === 'success') {
        this.isVerified = true;
        this.toasterService.success('Your address is now verified');
      }
    } catch (err) {
      this.isVerified = false;
      this.toasterService.error(err?.message);
    }

    this.detectChanges();
  }

  async unValidate(): Promise<void> {
    this.isVerified = undefined;

    try {
      const response = await (<any>this.client.delete(
        'api/v3/blockchain/unique-onchain/validate',
        {
          address: this.currentAddress,
        }
      ));

      if (response.status === 'success') {
        this.isVerified = false;
        this.toasterService.success(
          'Your address verification has been removed'
        );
      }
    } catch (err) {
      this.isVerified = true;
      this.toasterService.error(err.message);
    }

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this._downloadTimer) {
      clearTimeout(this._downloadTimer);
    }
    if (this._externalTimer) {
      clearInterval(this._externalTimer);
    }
    this.walletSubscription.unsubscribe();
  }

  get addressInput() {
    return this.form.get('addressInput');
  }
}
