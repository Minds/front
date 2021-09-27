import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ethers, Contract } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';

@Injectable({ providedIn: 'root' })
export class SkaleService {
  // Current provider.
  private provider;

  // SKALE chain name.
  private skaleChainName = '';

  // SKALE rpc url.
  private skaleRpcUrl = '';

  // Address of SKALE deposit box.
  private depositBoxAddress: string = '';

  // ABI of SKALE deposit box.
  private depositBoxAbi: any = {};

  // Address of MINDS ERC20 on SKALE.
  private skaleERC20Address: string = '';

  // ABI of MINDS ERC20 on SKALE.
  private skaleERC20Abi: any = {};

  // SKALE token manager ABI.
  private skaleTokenManagerAbi: any;

  // SKALE token manager address.
  private skaleTokenManagerAddress: string = '';

  // SKALE community pool ABI.
  private skaleCommunityPoolAbi: any;

  // SKALE community pool address.
  private skaleCommunityPoolAddress: string = '';

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    config: ConfigsService
  ) {
    const blockchainConfig = config.get('blockchain');
    const skaleConfig = config.get('skale');

    this.depositBoxAddress =
      blockchainConfig['skale'][
        'skale_contracts_mainnet'
      ].deposit_box_erc20_address;
    this.depositBoxAbi =
      blockchainConfig['skale'][
        'skale_contracts_mainnet'
      ].deposit_box_erc20_abi;

    this.skaleCommunityPoolAbi =
      blockchainConfig['skale']['skale_contracts_mainnet'].community_pool_abi;

    // SKALE community pool address.
    this.skaleCommunityPoolAddress =
      blockchainConfig['skale'][
        'skale_contracts_mainnet'
      ].community_pool_address;

    this.skaleTokenManagerAbi =
      blockchainConfig['skale'][
        'skale_contracts_skale_network'
      ].token_manager_erc20_abi;
    this.skaleTokenManagerAddress =
      blockchainConfig['skale'][
        'skale_contracts_skale_network'
      ].token_manager_erc20_address;

    this.skaleERC20Abi = blockchainConfig['skale']['erc20_contract']['abi'];

    this.skaleRpcUrl = skaleConfig['rpc_url'];
    this.skaleChainName = skaleConfig['chain_name'];
    this.skaleERC20Address = skaleConfig['erc20_address'];

    // init provider.
    this.provider = new ethers.providers.Web3Provider(window.ethereum);

    // warn if wallet is not unlocked.
    this.provider
      .getSigner()
      .getAddress()
      .catch(e => {
        this.toast.warn('Please unlock your wallet and reload.');
      });
  }

  /**
   * Gets mainnet token balance.
   * @returns { Promise<number> }
   */
  public async getMainnetTokenBalance(): Promise<number> {
    const currentWalletAddress = await this.provider.getSigner().getAddress();
    const mindsToken = await this.getMindsTokenMainnet();
    return mindsToken.balanceOf(currentWalletAddress);
  }

  /**
   * Gets SKALE token balance.
   * @returns { Promise<number> }
   */
  public async getSkaleTokenBalance(): Promise<number> {
    const currentWalletAddress = await this.provider.getSigner().getAddress();
    const mindsToken = await this.getMindsTokenSkale();
    return mindsToken.balanceOf(currentWalletAddress);
  }

  /**
   * Gets allowance for relevant deposit or withdraw contract.
   * @returns { Promise<number> } - allowance of tokens in 'ether' units.
   */
  public async getERC20Allowance(): Promise<number> {
    const currentWalletAddress = await this.provider.getSigner().getAddress();

    let allowanceObj = {};

    if (await this.isOnMainnet()) {
      const mindsToken = await this.getMindsTokenMainnet();

      allowanceObj = await mindsToken.allowance(
        currentWalletAddress,
        this.depositBoxAddress
      );
    } else if (await this.isOnSkaleNetwork()) {
      const mindsToken = await this.getMindsTokenSkale();

      allowanceObj = await mindsToken.allowance(
        currentWalletAddress,
        this.skaleTokenManagerAddress
      );
    }

    if (!isBigNumberish(allowanceObj)) {
      throw new Error('Checking allowance for an unsupported network');
    }

    return parseInt(ethers.utils.formatEther(allowanceObj));
  }

  /**
   * Approve the spend of X tokens
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approve(amount: number): Promise<unknown> {
    if (!amount) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const amountWei = this.web3Wallet.toWei(amount);

    let mindsToken, receiverContractAddress;

    if (await this.isOnMainnet()) {
      // for mainnet, we're approving deposits.
      mindsToken = await this.getMindsTokenMainnet();
      receiverContractAddress = this.depositBoxAddress;
    } else if (await this.isOnSkaleNetwork()) {
      // for SKALE network, we're approving withdrawals.
      receiverContractAddress = this.skaleTokenManagerAddress;
      mindsToken = await this.getMindsTokenSkale();
    } else if (!mindsToken || !receiverContractAddress) {
      this.toast.warn('Network unsupported.');
      throw new Error('Approving for an unsupported network');
    }

    const approvalTx = await mindsToken.approve(
      receiverContractAddress,
      amountWei
    );

    const receipt = await approvalTx.wait();
    return receipt;
  }

  /**
   * Calls to deposit X amount of tokens.
   * @param { number } amount - amount of tokens to deposit.
   * @returns { Promise<void> }
   */
  public async deposit(amount: number): Promise<unknown> {
    if (!(await this.isOnMainnet())) {
      this.toast.warn('Unavailable on this network - please switch');
      return;
    }

    if (!amount) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const amountWei = this.web3Wallet.toWei(amount);

    const depositBox = new ethers.Contract(
      this.depositBoxAddress,
      this.depositBoxAbi,
      this.provider.getSigner()
    );

    const depositTx = await depositBox.depositERC20(
      this.skaleChainName,
      this.web3Wallet.config.token.address,
      currentWalletAddress,
      amountWei,
      {
        // type: 2,
        gasLimit: 6500000,
      }
    );

    const depositReceipt = await depositTx;
    return depositReceipt;
  }

  /**
   * Withdraw to mainnet
   * @param { number } amount
   * @returns { Promise<void> }
   */
  public async withdraw(amount: number): Promise<unknown> {
    if (!(await this.isOnSkaleNetwork())) {
      this.toast.warn('Unavailable on this network - please switch');
      return;
    }

    if (!amount) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const amountWei = this.web3Wallet.toWei(amount);

    const skaleTokenManager = new ethers.Contract(
      this.skaleTokenManagerAddress,
      this.skaleTokenManagerAbi,
      this.provider.getSigner()
    );

    const withdrawTx = await skaleTokenManager.exitToMainERC20(
      this.web3Wallet.config.token.address,
      currentWalletAddress,
      amountWei,
      {
        // type: 2,
        gasLimit: 8000000,
      }
    );

    const withdrawReceipt = await withdrawTx;
    return withdrawReceipt;
  }

  /**
   * Calls to switch network to mainnet / rinkeby.
   * @returns { Promise<void> }
   */
  public switchNetworkMainnet(): Promise<void> {
    return this.networkSwitch.switchToMainnet(this.provider);
  }

  /**
   * Calls to switch network to SKALE.
   * @returns { Promise<void> }
   */
  public switchNetworkSkale(): Promise<void> {
    return this.networkSwitch.switchToSkale(this.provider, this.skaleRpcUrl);
  }

  /**
   * Is on SKALE network.
   * @returns { Promise<boolean> }
   */
  public async isOnSkaleNetwork(): Promise<boolean> {
    return this.networkSwitch.isOnSkaleNetwork(this.provider);
  }

  /**
   * Is on mainnet / rinkeby.
   * @returns { Promise<boolean> }
   */
  public async isOnMainnet(): Promise<boolean> {
    return this.networkSwitch.isOnMainnet(this.provider);
  }

  /**
   * Gets Minds token on mainnet / rinkeby.
   * @returns { Promise<Contract> }
   */
  private async getMindsTokenMainnet(): Promise<Contract> {
    return new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );
  }

  /**
   * Gets Minds token on SKALE network.
   * @returns { Promise<Contract> }
   */
  private async getMindsTokenSkale(): Promise<Contract> {
    return new ethers.Contract(
      this.skaleERC20Address,
      this.skaleERC20Abi,
      this.provider.getSigner()
    );
  }

  /**
   * Transfer tokens to another user
   * @param toAddress - recipient address.
   * @param amountEther - amount to transfer in whole Ether denomination - NOT WEI.
   * @returns { unknown } - transaction receipt.
   */
  public async transfer(
    toAddress: string,
    amountEther: number
  ): Promise<unknown> {
    if (!this.isOnSkaleNetwork()) {
      this.toast.warn('Incorrect network, please switch and try again.');
      await this.switchNetworkSkale(); // will trigger reload.
      return;
    }

    const amountWei = this.web3Wallet.toWei(amountEther);

    const mindsToken = await this.getMindsTokenSkale();
    return await mindsToken.transfer(toAddress, amountWei);
  }

  /**
   * Gets SKALE community pool contract  (on Rinkeby)
   * @returns { Contract } SKALE community pool contract, on Rinkeby.
   */
  private getCommunityPoolSkale(): Contract {
    return new ethers.Contract(
      this.skaleCommunityPoolAddress,
      this.skaleCommunityPoolAbi,
      this.provider.getSigner()
    );
  }

  /**
   * Deposit to the community pool, to fund exits from SKALE chain.
   * @param { number } amountEther - amount to deposit in Ether.
   * @returns { Promise<void> }
   */
  public async depositCommunityPool(amountEther: number): Promise<void> {
    const communityPool = await this.getCommunityPoolSkale();
    const amountWei = this.web3Wallet.toWei(amountEther);
    return communityPool.rechargeUserWallet(this.skaleChainName, {
      value: amountWei,
    });
  }

  /**
   * Withdraw ETH from the community pool.
   * @param { number } amountEther - amount to withdraw in Ether.
   * @returns { Promise<void> }
   */
  public async withdrawCommunityPool(amountEther: number): Promise<void> {
    const communityPool = await this.getCommunityPoolSkale();
    const amountWei = this.web3Wallet.toWei(amountEther);
    return communityPool.withdrawFunds(this.skaleChainName, amountWei);
  }

  /**
   * Gets current community pool balance
   * @returns { Promise<string> } current community pool balance in Ether denomination.
   */
  public async getCommunityPoolBalance(): Promise<string> {
    const communityPool = await this.getCommunityPoolSkale();
    return this.web3Wallet.fromWei(
      await communityPool.getBalance(this.skaleChainName)
    );
  }
}
