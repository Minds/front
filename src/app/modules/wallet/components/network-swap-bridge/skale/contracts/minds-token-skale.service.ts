import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { AbstractSkaleMindsContractService } from './abstract-skale-minds-contract-service';

/**
 * Contract service for the Minds Token on the SKALE network (skMINDS).
 */
@Injectable({ providedIn: 'root' })
export class SkaleMindsTokenContractService extends AbstractSkaleMindsContractService {
  // skMINDS Token ABI.
  private skMindsTokenAbi;

  // skMINDS Token address.
  private skMindsTokenAddress;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    super(web3Wallet, config, networkSwitch);

    if (this.skaleConfig) {
      this.skMindsTokenAbi = this.skaleConfig['erc20_contract']['abi'];
      this.skMindsTokenAddress = this.skaleConfig['erc20_address'];
    }
  }

  /**
   * skMINDS Token contract instance.
   * @returns { Contract } - skMINDS Token contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.skMindsTokenAddress,
      this.skMindsTokenAbi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Gets SKALE token balance.
   * @returns { Promise<number> }
   */
  public async getSkaleTokenBalance(): Promise<number> {
    if (!this.isOnSkaleNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const currentWalletAddress = await this.getWalletAddress();
    const mindsToken = this.getContract();
    return mindsToken.balanceOf(currentWalletAddress);
  }

  /**
   * Approves an amount for spend.
   * @param { string } - receiverContractAddress - receiver contract address to approve.
   * @param { number } - amount - amount to approve in Ether denomination.
   * @returns { Promise<any> }
   */
  public async approve(
    receiverContractAddress: string,
    amount: number
  ): Promise<any> {
    const mindsToken = await this.getContract();
    const amountWei = this.web3Wallet.toWei(amount);
    return mindsToken.approve(receiverContractAddress, amountWei);
  }

  /**
   * Transfer tokens from the current wallet to another wallet.
   * @param { string } toAddress - the address to send to.
   * @param { number } amount - the amount to send in Ether denomination.
   * @returns { Promise<any> }
   */
  public async transfer(toAddress: string, amount: number): Promise<any> {
    if (!this.isOnSkaleNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const amountWei = this.web3Wallet.toWei(amount);

    const mindsToken = await this.getContract();
    return mindsToken.transfer(toAddress, amountWei);
  }
}
