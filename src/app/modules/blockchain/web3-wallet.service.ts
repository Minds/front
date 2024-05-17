import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Web3Provider, ExternalProvider } from '@ethersproject/providers';
import { BigNumber, BigNumberish, Contract, utils, Wallet } from 'ethers';
import { Web3ModalService } from '@bhayward93/web3modal-angular';
import asyncSleep from '../../helpers/async-sleep';
import { TransactionOverlayService } from './transaction-overlay/transaction-overlay.service';
import { ConfigsService } from '../../common/services/configs.service';
import { defaultAbiCoder, Interface } from 'ethers/lib/utils';
import { ToasterService } from '../../common/services/toaster.service';
import isMobileOrTablet from '../../helpers/is-mobile-or-tablet';
import { isSafari } from '../../helpers/is-safari';

type Address = string;

@Injectable()
export class Web3WalletService {
  public config; // TODO add types
  public provider: Web3Provider | null = null;
  protected unavailable: boolean = false;
  protected local: boolean = false;
  protected _ready: Promise<any>;
  protected _web3LoadAttempt: number = 0;

  constructor(
    protected transactionOverlay: TransactionOverlayService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private configs: ConfigsService,
    private web3modalService: Web3ModalService,
    private toast: ToasterService
  ) {
    this.config = this.configs.get('blockchain');
  }

  async initializeProvider() {
    if (!this.provider) {
      if (!this.checkDeviceIsSupported()) {
        return null;
      }
      const provider = await this.web3modalService.open();
      this.setProvider(provider);
    }

    return this.provider;
  }

  getSigner() {
    if (this.provider) {
      return this.provider.getSigner();
    }

    return null;
  }

  resetProvider() {
    this.provider = null;
    this.web3modalService.clearCachedProvider();
  }

  getABIInterface(abi: any) {
    return new Interface(abi);
  }

  setProvider(provider: ExternalProvider) {
    this.provider = new Web3Provider(provider);
  }

  async getWallets() {
    const address = await this.getCurrentWallet();

    if (!address) {
      return [];
    }

    return [address];
  }

  async getCurrentWallet(
    forceAuthorization: boolean = false
  ): Promise<string | false> {
    if (forceAuthorization) {
      await this.initializeProvider();
    }

    const signer = this.getSigner();

    if (!signer) {
      return false;
    }

    return await signer.getAddress();
  }

  async getBalance(): Promise<string | false> {
    const signer = this.getSigner();

    if (!signer) {
      return false;
    }

    const balance = await signer.getBalance();

    return balance.toString();
  }

  async isLocked() {
    return !(await this.getCurrentWallet());
  }

  async unlock() {
    if (await this.isLocked()) {
      try {
        await this.getCurrentWallet(true);
      } catch (e) {
        console.log(e);
      }
    }

    return !(await this.isLocked());
  }

  // Network

  async isSameNetwork() {
    const provider = this.provider;
    let chainId = null;

    if (provider) {
      const network = await provider.getNetwork();
      chainId = network.chainId;
    }

    return (chainId || 1) == this.config.client_network;
  }

  // Bootstrap

  setUp() {
    this.config = this.configs.get('blockchain');
  }

  isUnavailable() {
    return this.unavailable;
  }

  // Contract Methods

  async sendSignedContractMethodWithValue(
    contract: Contract,
    method: string,
    params: any[],
    value: number | string,
    message: string = ''
  ): Promise<string> {
    const connectedContract = contract.connect(this.getSigner());

    let gasLimit: string;

    try {
      gasLimit = (
        await connectedContract.estimateGas[method](...params, { value })
      ).toHexString();
    } catch (e) {
      this.handleEstimateGasError(e);
      gasLimit = BigNumber.from(15000000).toHexString();
    }

    /**
     * Dispatch an EIP-2718 transaction for EIP-1559 compatibility.
     * ethers.js should fallback to legacy transactions if
     * the web3 provider is not equipped to deal with this tx type.
     *
     * maxFeePerGas and maxPriorityFeePerGas are omitted and left for
     * the web3 client to decide.
     */
    const txHash = await this.transactionOverlay.waitForExternalTx(
      () =>
        connectedContract[method](...params, {
          type: 2,
          value: value,
          gasLimit: gasLimit,
        }),
      message
    );

    await asyncSleep(1000); // Modals "cooldown"

    return txHash;
  }

  async sendSignedContractMethod(
    contract: any,
    method: string,
    params: any[],
    message: string = ''
  ): Promise<string> {
    return await this.sendSignedContractMethodWithValue(
      contract,
      method,
      params,
      0,
      message
    );
  }

  // Normal Transactions

  async sendTransaction(
    originalTxObject: any,
    message: string = ''
  ): Promise<string> {
    if (!originalTxObject.gasLimit) {
      try {
        const gasLimit = await this.getSigner().estimateGas(originalTxObject);
        originalTxObject.gasLimit = gasLimit.toHexString();
      } catch (e) {
        console.log(e);
        originalTxObject.gasLimit = 15000000;
      }
    }

    const txHash = await this.transactionOverlay.waitForExternalTx(
      () => this.getSigner().sendTransaction(originalTxObject),
      message
    );

    await asyncSleep(1000); // Modals "cooldown"

    return txHash;
  }

  getContract(address: Address, abi: string[]): Contract {
    return new Contract(address, abi);
  }

  toWei(amount: number | string, unit?: BigNumberish) {
    const weiAmount = utils.parseUnits(amount.toString(), unit).toString();
    return BigNumber.from(weiAmount).toHexString();
  }

  fromWei(amount: BigNumber, unit?: BigNumberish) {
    return utils.formatUnits(amount.toString(), unit).toString();
  }

  encodeParams(types: (string | utils.ParamType)[], values: any[]) {
    return defaultAbiCoder.encode(types, values);
  }

  privateKeyToAccount(privateKey: string | utils.Bytes | utils.SigningKey) {
    if (typeof privateKey === 'string') {
      if (privateKey.indexOf('0x') !== 0) {
        return new Wallet('0x' + privateKey).address;
      }
    }

    return new Wallet(privateKey).address;
  }

  getOnChainInterfaceLabel() {
    if (this.local) {
      return 'Private Key';
    }

    if (
      window.web3.currentProvider.constructor.name === 'MetamaskInpageProvider'
    ) {
      return 'Metamask';
    } else if (
      window.web3.currentProvider.constructor.name === 'EthereumProvider'
    ) {
      return 'Mist';
    } else if (window.web3.currentProvider.constructor.name === 'o') {
      return 'Parity';
    }

    return 'Local Interface';
  }

  /**
   * Handles errors on estimateGas failure.
   * @param {code?: string} e - error object.
   * @returns { void }
   */
  private handleEstimateGasError(e: { code?: string }): void {
    if (e?.code && e.code.indexOf('UNPREDICTABLE_GAS_LIMIT') > -1) {
      this.toast.error(
        'Unable to predict gas limit. Falling back to high limit - excess gas will be returned.'
      );
    } else if (e?.code && e.code.indexOf('INSUFFICIENT_FUNDS') > -1) {
      this.toast.error(
        'Unable to predict gas limit as you do not have sufficient Ether.'
      );
    } else {
      console.error(e);
    }
  }

  /**
   * Whether device device is supported.
   * Will show a generic toast error if the device is not.
   * @returns { boolean } - true if device is supported.
   */
  public checkDeviceIsSupported(): boolean {
    if (isMobileOrTablet()) {
      this.toast.error(
        'Sorry, this feature is unavailable on mobile. Please use a desktop.'
      );
      return false;
    }

    if (isSafari()) {
      this.toast.error(
        'Sorry, this feature is not supported on Safari. Please use a different browser.'
      );
      return false;
    }

    return true;
  }

  // Service provider

  static _(
    transactionOverlay: TransactionOverlayService,
    platformId: Object,
    configs: ConfigsService,
    web3modalService: Web3ModalService,
    toast: ToasterService
  ) {
    return new Web3WalletService(
      transactionOverlay,
      platformId,
      configs,
      web3modalService,
      toast
    );
  }
}
