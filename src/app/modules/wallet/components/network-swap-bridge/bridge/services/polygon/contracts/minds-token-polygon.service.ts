import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { AbstractPolygonMindsContractService } from './abstract-polygon-minds-contract-service';

/**
 * Contract service for the Minds Token on the SKALE network (maticMINDS).
 */
@Injectable({ providedIn: 'root' })
export class PolygonMindsTokenContractService extends AbstractPolygonMindsContractService {
  // maticMINDS Token ABI.
  private maticMindsTokenAbi;

  // maticMINDS Token address.
  private maticMindsTokenAddress;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    super(web3Wallet, config, networkSwitch);

    if (this.polygonConfig && this.polygonAbi) {
      (this.maticMindsTokenAbi = this.polygonAbi.abi),
        (this.maticMindsTokenAddress = this.polygonConfig.Main.POSContracts.Tokens.DummyERC20);
    }
  }

  /**
   * maticMINDS Token contract instance.
   * @returns { Contract } - maticMINDS Token contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.maticMindsTokenAddress,
      this.maticMindsTokenAbi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Gets MATIC token balance.
   * @returns { Promise<number> }
   */
  public async getPolygonTokenBalance(): Promise<number> {
    if (!this.isOnPolygonNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const currentWalletAddress = await this.getWalletAddress();
    const mindsToken = this.getContract();
    return mindsToken.balanceOf(currentWalletAddress);
  }

  public async getPolygonTokenAllowance(): Promise<number> {
    if (!this.isOnPolygonNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const currentWalletAddress = await this.getWalletAddress();
    const mindsToken = this.getContract();
    return mindsToken.allowance(currentWalletAddress);
  }

  public async increasePolygonTokenAllowance(amount): Promise<number> {
    if (!this.isOnPolygonNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const currentWalletAddress = await this.getWalletAddress();
    const mindsToken = this.getContract();
    console.log(mindsToken);
    return mindsToken.increaseAllowance(currentWalletAddress, amount);
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
    if (!this.isOnPolygonNetwork()) {
      throw new Error('Unavailable on this network - please switch');
    }

    const amountWei = this.web3Wallet.toWei(amount);

    const mindsToken = await this.getContract();
    return mindsToken.transfer(toAddress, amountWei);
  }
}
