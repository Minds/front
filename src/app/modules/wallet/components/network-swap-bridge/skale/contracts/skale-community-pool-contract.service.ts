import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { AbstractSkaleMindsContractService } from './abstract-skale-minds-contract-service';

/**
 * Instance of SKALE CommunityPool contract.
 * Allows users to fund exits from the SKALE chain with mainnet funds.
 */
@Injectable({ providedIn: 'root' })
export class SkaleCommunityPoolContractService extends AbstractSkaleMindsContractService {
  // CommunityPool contract address.
  private skaleCommunityPoolAddress: any;

  /// CommunityPool contract ABI.
  private skaleCommunityPoolAbi: string = '';

  // SKALE chain name.
  private skaleChainName = '';

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    super(web3Wallet, config, networkSwitch);

    if (this.skaleConfig) {
      this.skaleCommunityPoolAbi = this.skaleConfig[
        'skale_contracts_mainnet'
      ].community_pool_abi;

      this.skaleCommunityPoolAddress = this.skaleConfig[
        'skale_contracts_mainnet'
      ].community_pool_address;

      this.skaleChainName = this.skaleConfig['chain_name'];
    }
  }

  /**
   * Gets instance of CommunityPool contract.
   * @returns { Contract } - CommunityPool contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.skaleCommunityPoolAddress,
      this.skaleCommunityPoolAbi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Deposit to the community pool, to fund exits from SKALE chain.
   * @param { number } amountEther - amount to deposit in Ether denomination.
   * @returns { Promise<any> }
   */
  public async deposit(amountEther: number): Promise<any> {
    if (!this.isOnMainnet()) {
      throw new Error(
        'Unable to deposit to community pool on this network - please switch to mainnet'
      );
    }

    const amountWei = this.web3Wallet.toWei(amountEther);
    const currentAddress = await this.getWalletAddress();

    const communityPool = this.getContract();
    return communityPool.rechargeUserWallet(
      this.skaleChainName,
      currentAddress,
      {
        value: amountWei,
      }
    );
  }

  /**
   * Withdraw ETH from the community pool.
   * @param { number } amountEther - amount to withdraw in Ether denomination.
   * @returns { Promise<any> }
   */
  public async withdraw(amountEther: number): Promise<any> {
    if (!this.isOnMainnet()) {
      throw new Error(
        'Unable to withdraw from community pool on this network - please switch to mainnet'
      );
    }

    const amountWei = this.web3Wallet.toWei(amountEther);

    const communityPool = this.getContract();

    // gas limit here can vary - especially when draining a pool.
    // ethers struggles to estimate this.
    return communityPool.withdrawFunds(this.skaleChainName, amountWei, {
      gasLimit: 100000,
    });
  }

  /**
   * Gets current community pool balance.
   * @returns { Promise<number> } - current community pool balance in Ether denomination.
   */
  public async getBalance(): Promise<number> {
    if (!this.isOnMainnet()) {
      throw new Error(
        'Unable to get community pool balance on this network - please switch to mainnet'
      );
    }

    const currentAddress = await this.getWalletAddress();

    const communityPool = this.getContract();
    const balance = await communityPool.getBalance(
      currentAddress,
      this.skaleChainName
    );

    return parseFloat(this.web3Wallet.fromWei(balance));
  }
}
