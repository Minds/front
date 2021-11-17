import { Injectable } from '@angular/core';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { AbstractSkaleMindsContractService } from './abstract-skale-minds-contract-service';
import { ConfigsService } from '../../../../../../common/services/configs.service';
/**
 * Signed mainnet MINDS token contract service.
 */
@Injectable({ providedIn: 'root' })
export class MindsTokenMainnetSignedContractService extends AbstractSkaleMindsContractService {
  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    super(web3Wallet, config, networkSwitch);
  }

  /**
   * Gets signed mainnet MINDS token contract instance.
   * @returns { Contract } mainnet MINDS token contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Gets token balance.
   * @returns { Promise<number> }
   */
  public async balanceOf(address: string = ''): Promise<number> {
    if (!this.isOnMainnet()) {
      throw new Error('Unavailable on this network - please switch');
    }

    if (address === '') {
      address = await this.getWalletAddress();
    }

    const mindsToken = this.getContract();
    return mindsToken.balanceOf(address);
  }
}
