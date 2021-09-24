import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ethers, Contract } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { isBigNumberish } from '@ethersproject/bignumber/lib/bignumber';

@Injectable({ providedIn: 'root' })
export class SkaleService {
  // chain ids used (hex)
  private chainIds = {
    skale: '',
    mainnet: '',
  };

  // current provider
  private provider;

  // SKALE chain name
  private skaleChainName = '';

  // SKALE rpc url
  private skaleRpcUrl = '';

  // Address of SKALE deposit box
  private depositBoxAddress: string = '';

  // ABI of SKALE deposit box
  private depositBoxAbi: any = {};

  // Address of MINDS ERC20 on SKALE.
  private skaleERC20Address: string = '';

  // ABI of MINDS ERC20 on SKALE.
  private skaleERC20Abi: any = {};

  skaleTokenManagerAbi;
  skaleTokenManagerAddress;

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
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
    this.chainIds.skale = skaleConfig['chain_id_hex'];
    this.skaleERC20Address = skaleConfig['erc20_address'];

    this.chainIds.mainnet =
      config.get('environment') === 'development'
        ? '0x4' // rinkeby
        : '0x1'; // mainnet

    // init provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
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
  public async approve(amount: number): Promise<void> {
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
  public async deposit(amount: number): Promise<void> {
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
  public async withdraw(amount: number): Promise<void> {
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
    return this.switchNetwork(this.chainIds.mainnet);
  }

  /**
   * Calls to switch network to SKALE.
   * @returns { Promise<void> }
   */
  public switchNetworkSkale(): Promise<void> {
    return this.switchNetwork(this.chainIds.skale);
  }

  /**
   * Gets current chain ID as a number.
   * @returns { number } current chain id.
   */
  public async getChainId(): Promise<number> {
    const { chainId } = await this.provider.getNetwork();
    return chainId;
  }

  /**
   * Is on SKALE network.
   * @returns { Promise<boolean> }
   */
  public async isOnSkaleNetwork(): Promise<boolean> {
    const chainId = await this.getChainId();
    return chainId === parseInt(this.chainIds.skale, 16);
  }

  /**
   * Is on mainnet / rinkeby.
   * @returns { Promise<boolean> }
   */
  public async isOnMainnet(): Promise<boolean> {
    const chainId = await this.getChainId();
    return chainId === parseInt(this.chainIds.mainnet, 16);
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
   * Calls to switch network. Encapsulation to be kept private
   * to prevent this from being called with unsupported networks.
   * TODO: Break off into separate service for reusability.
   * @param { string } - hex of chain id - defaults to mainnet chain id.
   * @returns { Promise<void> }
   */
  private async switchNetwork(
    chainId: string = this.chainIds.mainnet
  ): Promise<void> {
    const currentChainId = await this.getChainId();

    if (parseInt(chainId, 16) === currentChainId) {
      this.toast.warn('Already on this network');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      window.location.reload();
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{ chainId: chainId, rpcUrl: this.skaleRpcUrl }],
          });
          window.location.reload();
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }
}
