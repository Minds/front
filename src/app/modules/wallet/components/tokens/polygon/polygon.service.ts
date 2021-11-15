import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';
import { MindsTokenMainnetSignedContractService } from '../skale/contracts/minds-token-mainnet-signed-contract.service';
import { MaticPOSClient } from '@maticnetwork/maticjs';
import { PolygonMindsTokenContractService } from './contracts/minds-token-polygon.service';
import { PolygonDepositBoxContractService } from './contracts/polygon-deposit-box-contract.service';

@Injectable({ providedIn: 'root' })
export class PolygonService {
  public Network = require('@maticnetwork/meta/network');

  public parentProvider =
    'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
  public maticProvider = 'https://rpc-endpoints.superfluid.dev/mumbai';

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private mindsToken: MindsTokenMainnetSignedContractService,
    private maticService: PolygonMindsTokenContractService,
    private boxService: PolygonDepositBoxContractService
  ) {}

  // for mumbai testnet
  public maticPOSClient = new MaticPOSClient({
    network: 'testnet',
    version: 'mumbai',
    parentProvider: this.parentProvider,
    maticProvider: this.maticProvider,
  });

  /**
   * Reinitialize wallet by resetting then initializing.
   * @returns { Promise<void> }
   */
  public async reinitializeWallet(): Promise<void> {
    this.web3Wallet.resetProvider();
    await this.web3Wallet.initializeProvider();
  }

  /**
   * Calls to switch network to mainnet / rinkeby.
   * @returns { Promise<void> }
   */
  public async switchNetworkMainnet(): Promise<void> {
    await this.networkSwitch.switch(this.networkSwitch.networks.mainnet.id);
    await this.reinitializeWallet();
  }

  /**
   * Calls to switch network to SKALE.
   * @returns { Promise<void> }
   */
  public async switchNetworkPolygon(): Promise<void> {
    await this.networkSwitch.switch(this.networkSwitch.networks.polygon.id);
    await this.reinitializeWallet();
  }

  /**
   * Is on POLYGON network.
   * @returns { Promise<boolean> }
   */
  public isOnPolygonNetwork(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.polygon.id
    );
  }

  /**
   * Is on mainnet / rinkeby.
   * @returns { Promise<boolean> }
   */
  public isOnMainnet(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.mainnet.id
    );
  }

  /**
   * Gets mainnet token balance.
   * @returns { Promise<number> }
   */
  public async getMainnetTokenBalance(): Promise<number> {
    return this.mindsToken.balanceOf();
  }

  /**
   * Gets MATIC  token balance.
   * @returns { Promise<number> }
   */
  public async getMaticTokenBalance(): Promise<number> {
    return this.maticService.getPolygonTokenBalance();
  }

  /**
   * Gets MATIC  token balance.
   * @returns { Promise<number> }
   */
  public async getPolygonTokenAllowance(): Promise<number> {
    return this.maticService.getPolygonTokenAllowance();
  }

  /**
   * Approve the spend of X tokens.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approve(amount: number): Promise<any> {
    if (!amount) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    if (this.isOnMainnet()) {
      // return this.depositBox.approveForThisContract(amount);
    } else if (this.isOnPolygonNetwork()) {
      const web3Provider = await this.web3Wallet.provider.provider;
      const from = await this.web3Wallet.getSigner().getAddress();
      this.maticPOSClient.web3Client.setParentProvider(web3Provider);
      const tx = await this.maticPOSClient.approveERC20ForDeposit(
        '0x499d11E0b6eAC7c0593d8Fb292DCBbF815Fb29Ae',
        amount,
        { from }
      );
      console.log('transaciton hash', tx);
      // this.maticService.approve(amount);
    } else {
      this.toast.warn('Unable to approve for this network');
      throw new Error('Approving for an unsupported network');
    }
  }
}
