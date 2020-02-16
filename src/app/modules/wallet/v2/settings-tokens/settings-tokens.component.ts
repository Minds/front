import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  Inject,
  PLATFORM_ID,
  ViewRef,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { LocalWalletService } from '../../../blockchain/local-wallet.service';
import { BlockchainService } from '../../../blockchain/blockchain.service';
import { Web3WalletService } from '../../../blockchain/web3-wallet.service';
import { getBrowser } from '../../../../utils/browser';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { WalletDashboardService } from '../dashboard.service';

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
export class WalletSettingsTokensComponent implements OnInit, OnDestroy {
  @Output() onchainAddressChanged: EventEmitter<any> = new EventEmitter();
  wallet;
  inProgress: boolean = false;
  linkingMetamask: boolean = false;
  error: string;
  display: Views;
  generatedAccount: any;
  providedAddress: string = '';
  hasExternal: boolean = false;
  currentAddress: string = '';
  downloadingMetamask: boolean = false;
  form;

  readonly cdnAssetsUrl: string;

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
    private formToastService: FormToastService,
    protected walletService: WalletDashboardService,
    configs: ConfigsService,
    @Inject(PLATFORM_ID) protected platformId: Object
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  // TODOOJM add fx to reload whenever the current setting is updated

  ngOnInit() {
    this.load();
  }

  async load() {
    this.wallet = await this.walletService.getWallet();
    // Check if already has an address
    this.currentAddress =
      this.session.getLoggedInUser().eth_wallet || this.wallet.receiver.address;
    if (this.currentAddress) {
      this.display = Views.CurrentAddress;
      this.onchainAddressChanged.emit();
    }

    this.form = new FormGroup({
      addressInput: new FormControl('', {
        validators: [Validators.required, this.validateAddressFormat],
      }),
    });

    this.checkExternal();
    this.detectChanges();
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
      this.currentAddress = this.generatedAccount.address;
    } catch (e) {
      console.error(e);
      // TODOOJM get rid of form toast
      // this.formToastService.error(e);
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
        this.inProgress = false;
        this.onchainAddressChanged.emit();
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
          setTimeout(() => {
            URL.revokeObjectURL(objectUrl);
            this.generatedAccount = null;
            this.onchainAddressChanged.emit();
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
      // TODOOJM get rid of form toast
      // this.formToastService.error(e);
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
    if (this.form.invalid || this.inProgress) {
      return;
    }
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.blockchain.setWallet({ address: this.addressInput.value });
      this.onchainAddressChanged.emit();
    } catch (e) {
      // TODOOJM get rid of form toast
      this.formToastService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;
      this.linkingMetamask = false;
      this.currentAddress = this.addressInput.value;
      this.display = Views.CurrentAddress;
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
    this.linkingMetamask = true;
    this.inProgress = true;
    await this.web3Wallet.ready();
    this.detectExternal();
    if (isPlatformBrowser(this.platformId)) {
      this._externalTimer = setInterval(() => {
        if (!(this.cd as ViewRef).destroyed) {
          this.detectExternal();
        }
      }, 1000);
    }
    this.detectChanges();
  }

  async detectExternal() {
    const address: string =
      (await this.web3Wallet.getCurrentWallet(true)) || '';

    if (this.providedAddress !== address) {
      this.providedAddress = address;
      this.currentAddress = address;
      if (isPlatformBrowser(this.platformId)) {
        if (address) {
          clearInterval(this._externalTimer);
          // this.provideAddress();
          this.provideMetamaskAddress(address);
          this.detectChanges();
        }
      }
      this.detectChanges();
    }
  }

  async provideMetamaskAddress(address) {
    try {
      this.inProgress = true;
      this.detectChanges();

      await this.blockchain.setWallet({ address: address });
      this.currentAddress = address;
      this.display = Views.CurrentAddress;
      this.onchainAddressChanged.emit();
    } catch (e) {
      // TODOOJM get rid of form toast
      this.formToastService.error(e);
      console.error(e);
    } finally {
      this.inProgress = false;
      this.linkingMetamask = false;
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
