import { Injectable } from '@angular/core';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { ethers, Contract } from 'ethers';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { TokenContractService } from '../../../../../blockchain/contracts/token-contract.service';
import { AbstractSkaleMindsContractService } from './abstract-skale-minds-contract-service';

/**
 * Service for interacting with the SKALE DepositBox contract.
 * Allows a user to deposit MINDS tokens on the mainnet
 * And receive skMINDS on the SKALE chain.
 */
@Injectable({ providedIn: 'root' })
export class SkaleDepositBoxContractService extends AbstractSkaleMindsContractService {
  // Address of SKALE deposit box.
  private depositBoxAddress: string = '';

  // ABI of SKALE deposit box.
  private depositBoxAbi: any = {};

  // SKALE chain name.
  private skaleChainName = '';

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService,
    private mainnetMindsToken: TokenContractService
  ) {
    super(web3Wallet, config, networkSwitch);

    if (this.skaleConfig) {
      this.depositBoxAddress = this.skaleConfig[
        'skale_contracts_mainnet'
      ].deposit_box_erc20_address;
      this.depositBoxAbi = this.skaleConfig[
        'skale_contracts_mainnet'
      ].deposit_box_erc20_abi;
      this.skaleChainName = this.skaleConfig['chain_name'];
    }
  }

  /**
   * DepositBox contract instance.
   * @returns DepositBox contract instance.
   */
  public getContract(): Contract {
    return new ethers.Contract(
      this.depositBoxAddress,
      this.depositBoxAbi,
      this.web3Wallet.getSigner()
    );
  }

  /**
   * Calls to deposit X amount of tokens.
   * @param { number } amount - amount of tokens to deposit.
   * @returns { Promise<any> }
   */
  public async deposit(amount: number): Promise<any> {
    if (!this.isOnMainnet()) {
      throw new Error('Unable to deposit on this network - please switch');
    }

    if (!amount) {
      throw new Error('You must provide an amount of tokens');
    }

    const amountWei = this.web3Wallet.toWei(amount);

    const depositBox = this.getContract();

    let depositReceipt = await this.web3Wallet.sendSignedContractMethod(
      depositBox,
      'depositERC20',
      [this.skaleChainName, this.web3Wallet.config.token.address, amountWei],
      ''
    );

    return depositReceipt;
  }

  /**
   * Gets allowance for relevant deposit or withdraw contract.
   * @returns { Promise<number> } - allowance of tokens in 'ether' units.
   */
  public async getERC20Allowance(): Promise<number> {
    if (!this.isOnMainnet()) {
      throw new Error(
        'Cannot get DepositBox allowance on this network - please switch'
      );
    }

    const currentWalletAddress = await this.getWalletAddress();

    if (!currentWalletAddress) {
      throw new Error('Unable to derive current wallet address');
    }

    const mindsToken = new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.web3Wallet.provider.getSigner()
    );

    let allowanceObj = await mindsToken.allowance(
      currentWalletAddress,
      this.depositBoxAddress
    );

    if (!isBigNumberish(allowanceObj)) {
      throw new Error(
        'Checking allowance for DepositBox for an unsupported network'
      );
    }

    return parseInt(ethers.utils.formatEther(allowanceObj));
  }

  /**
   * Approve the spend of X tokens
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approveForThisContract(amount: number): Promise<unknown> {
    if (!this.isOnMainnet()) {
      throw new Error(
        'Cannot approve for DepositBox on this network - please switch'
      );
    }

    if (!amount) {
      throw new Error('You must provide an amount of tokens');
    }

    const receipt = this.mainnetMindsToken.increaseApproval(
      this.depositBoxAddress,
      amount
    );

    return receipt;
  }
}
