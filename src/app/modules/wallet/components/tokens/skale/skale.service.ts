import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ethers } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Injectable({ providedIn: 'root' })
export class SkaleService {
  // chain ids used (hex)
  private chainIds = {
    skale: '',
    rinkeby: '0x4',
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

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    config: ConfigsService
  ) {
    const blockchainConfig = config.get('blockchain');
    const skaleConfig = config.get('skale');

    this.depositBoxAddress =
      blockchainConfig['skale']['skale_contracts'].deposit_box_erc20_address;
    this.depositBoxAbi =
      blockchainConfig['skale']['skale_contracts'].deposit_box_erc20_abi;
    this.skaleERC20Abi = blockchainConfig['skale']['erc20_contract']['abi'];

    this.skaleRpcUrl = skaleConfig['rpc_url'];
    this.skaleChainName = skaleConfig['chain_name'];
    this.chainIds.skale = skaleConfig['chain_id_hex'];
    this.skaleERC20Address = skaleConfig['erc20_address'];

    // init provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  /**
   * Gets mainnet token balance.
   * @returns { Promise<number> }
   */
  public async getMainnetTokenBalance(): Promise<number> {
    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const mindsToken = new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );

    return mindsToken.balanceOf(currentWalletAddress);
  }

  /**
   * Gets SKALE token balance.
   * TODO: Currency throws errors - need to fix.
   * @returns { Promise<number> }
   */
  public async getSkaleTokenBalance(): Promise<number> {
    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const mindsToken = new ethers.Contract(
      this.skaleERC20Address,
      this.skaleERC20Abi,
      this.provider.getSigner()
    );

    return mindsToken.balanceOf(currentWalletAddress);
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

    const mindsToken = new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );

    const approvalTx = await mindsToken.approve(
      this.depositBoxAddress,
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
    const { chainId } = await this.provider.getNetwork();

    if (chainId !== parseInt(this.chainIds.rinkeby, 16)) {
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

  // TODO: Withdraw
  public async withdraw(amount: number): Promise<void> {
    this.toast.warn('Not yet implemented');
  }

  /**
   * Calls to switch network to Rinkeby.
   * @returns { Promise<void> }
   */
  public switchNetworkRinkeby(): Promise<void> {
    return this.switchNetwork(this.chainIds.rinkeby);
  }

  /**
   * Calls to switch network to SKALE.
   * @returns { Promise<void> }
   */
  public switchNetworkSkale(): Promise<void> {
    return this.switchNetwork(this.chainIds.skale);
  }

  /**
   * Calls to switch network. Encapsulation to be kept private
   * to prevent this from being called with unsupported networks.
   * TODO: Break off into separate service for reusability.
   * @param { string } - hex of chain id - defaults to 0x4, rinkeby.
   * @returns { Promise<void> }
   */
  private async switchNetwork(chainId: string = '0x4'): Promise<void> {
    const currentChainId = (await this.provider.getNetwork())?.chainId;

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
