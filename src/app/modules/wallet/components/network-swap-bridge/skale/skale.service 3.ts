import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';
import { SkaleDepositBoxContractService } from './contracts/skale-deposit-box-contract.service';
import { SkaleMindsTokenContractService } from './contracts/minds-token-skale.service';
import { SkaleTokenManagerContractService } from './contracts/skale-token-manager-contract.service';
import { SkaleCommunityPoolContractService } from './contracts/skale-community-pool-contract.service';
import { MindsTokenMainnetSignedContractService } from './contracts/minds-token-mainnet-signed-contract.service';

@Injectable({ providedIn: 'root' })
export class SkaleService {
  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private depositBox: SkaleDepositBoxContractService,
    private skMindsToken: SkaleMindsTokenContractService,
    private tokenManager: SkaleTokenManagerContractService,
    private communityPool: SkaleCommunityPoolContractService,
    private mindsToken: MindsTokenMainnetSignedContractService
  ) {}

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
  public async switchNetworkSkale(): Promise<void> {
    await this.networkSwitch.switch(this.networkSwitch.networks.skale.id);
    await this.reinitializeWallet();
  }

  /**
   * Is on SKALE network.
   * @returns { Promise<boolean> }
   */
  public isOnSkaleNetwork(): boolean {
    return this.networkSwitch.isOnNetwork(this.networkSwitch.networks.skale.id);
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
   * Gets SKALE token balance.
   * @returns { Promise<number> }
   */
  public async getSkaleTokenBalance(): Promise<number> {
    return this.skMindsToken.getSkaleTokenBalance();
  }

  /**
   * Gets mainnet token balance.
   * @returns { Promise<number> }
   */
  public async getMainnetTokenBalance(): Promise<number> {
    return this.mindsToken.balanceOf();
  }

  /**
   * Gets allowance for relevant deposit or withdraw contract.
   * @returns { Promise<number> } - allowance of tokens in 'ether' units.
   */
  public async getERC20Allowance(): Promise<number> {
    await this.web3Wallet.initializeProvider();

    if (this.isOnMainnet()) {
      return this.depositBox.getERC20Allowance();
    } else if (this.isOnSkaleNetwork()) {
      return this.tokenManager.getERC20Allowance();
    }

    throw new Error('Checking allowance for an unsupported network');
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
      return this.depositBox.approveForThisContract(amount);
    } else if (this.isOnSkaleNetwork()) {
      return this.tokenManager.approveForThisContract(amount);
    } else {
      this.toast.warn('Unable to approve for this network');
      throw new Error('Approving for an unsupported network');
    }
  }

  /**
   * Calls to deposit X amount of tokens.
   * @param { number } amount - amount of tokens to deposit.
   * @returns { Promise<void> }
   */
  public async deposit(amount: number): Promise<unknown> {
    return this.depositBox.deposit(amount);
  }

  /**
   * Withdraw to mainnet.
   * @param { number } amount
   * @returns { Promise<void> }
   */
  public async withdraw(amount: number): Promise<unknown> {
    return this.tokenManager.withdraw(amount);
  }

  /**
   * Transfer tokens to another user.
   * @param toAddress - recipient address.
   * @param amountEther - amount to transfer in whole Ether denomination - NOT WEI.
   * @returns { unknown } - transaction receipt.
   */
  public async transfer(toAddress: string, amountEther: number): Promise<any> {
    return this.skMindsToken.transfer(toAddress, amountEther);
  }

  /**
   * Deposit to the community pool, to fund exits from SKALE chain.
   * @param { number } amountEther - amount to deposit in Ether.
   * @returns { Promise<void> }
   */
  public async depositCommunityPool(amountEther: number): Promise<void> {
    await this.communityPool.deposit(amountEther);
  }

  /**
   * Withdraw ETH from the community pool.
   * @param { number } amountEther - amount to withdraw in Ether.
   * @returns { Promise<void> }
   */
  public async withdrawCommunityPool(amountEther: number): Promise<void> {
    return this.communityPool.withdraw(amountEther);
  }

  /**
   * Gets current community pool balance
   * @returns { Promise<string> } current community pool balance in Ether denomination.
   */
  public async getCommunityPoolBalance(): Promise<number> {
    return this.communityPool.getBalance();
  }
}
