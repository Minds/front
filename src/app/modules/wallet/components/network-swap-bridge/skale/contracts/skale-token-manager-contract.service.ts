import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { AbstractSkaleMindsContractService } from './abstract-skale-minds-contract-service';
import { SkaleMindsTokenContractService } from './minds-token-skale.service';

/**
 * SKALE Token Manager Contract Service - allows the withdrawal of tokens from SKALE network skMINDS to mainnet MINDS
 */
@Injectable({ providedIn: 'root' })
export class SkaleTokenManagerContractService extends AbstractSkaleMindsContractService {
  // SKALE token manager ABI.
  private skaleTokenManagerAbi: any;

  // SKALE token manager address.
  private skaleTokenManagerAddress: string = '';

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService,
    private skMindsToken: SkaleMindsTokenContractService
  ) {
    super(web3Wallet, config, networkSwitch);

    if (this.skaleConfig) {
      this.skaleTokenManagerAbi = this.skaleConfig[
        'skale_contracts_skale_network'
      ].token_manager_erc20_abi;
      this.skaleTokenManagerAddress = this.skaleConfig[
        'skale_contracts_skale_network'
      ].token_manager_erc20_address;
    }
  }

  /**
   * SKALE TokenManager contract instance.
   * @returns { Contract } SKALE TokenManager contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.skaleTokenManagerAddress,
      this.skaleTokenManagerAbi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Withdraw tokens from SKALE network to mainnet.
   * @param { number } amount - amount of tokens to withdraw in Ether denomination.
   * @returns { Promise<any> }
   */
  public async withdraw(amount: number): Promise<any> {
    if (!this.isOnSkaleNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    if (!amount) {
      throw new Error('You must provide an amount of tokens');
    }

    const amountWei = this.web3Wallet.toWei(amount);

    const tokenManager = this.getContract();

    // Bypassing web3 wallet so we can send envelope 1 tx.
    const withdrawReceipt = await tokenManager.exitToMainERC20(
      this.web3Wallet.config.token.address,
      amountWei,
      { gasLimit: 200000 }
    );

    return withdrawReceipt;
  }

  /**
   * Calls to approve spend for the SKALE token manager contract.
   * @param { number } amount - amount of tokens to approve in Ether denomination.
   */
  public async approveForThisContract(amount: number): Promise<unknown> {
    if (!this.isOnSkaleNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    if (!amount) {
      throw new Error('You must provide an amount of tokens');
    }

    return this.skMindsToken.approve(this.skaleTokenManagerAddress, amount);
  }

  /**
   * Gets the ERC20 Allowance for the TokenManager contract.
   * @returns { Promise<number> } - ERC20 allowance in Ether denomination.
   */
  public async getERC20Allowance(): Promise<number> {
    if (!this.isOnSkaleNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const currentWalletAddress = await this.getWalletAddress();

    if (!currentWalletAddress) {
      throw new Error('Unable to derive current wallet address');
    }

    const skMindsToken = this.skMindsToken.getContract();

    let allowanceObj = await skMindsToken.allowance(
      currentWalletAddress,
      this.skaleTokenManagerAddress
    );

    if (!isBigNumberish(allowanceObj)) {
      throw new Error('Checking allowance for an unsupported network');
    }

    return parseInt(ethers.utils.formatEther(allowanceObj));
  }
}
