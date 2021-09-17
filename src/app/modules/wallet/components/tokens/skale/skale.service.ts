import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { ethers } from 'ethers';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Injectable({ providedIn: 'root' })
export class SkaleService {
  private chainIds = {
    skale: '',
    rinkeby: '0x4',
  };

  private provider;
  private skaleChainName = '';
  private rpcUrl = '';
  private depositBoxAddress: string = '';
  private depositBoxAbi: any = {};

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    config: ConfigsService
  ) {
    const blockchainConfig = config.get('blockchain');
    const skaleConfig = config.get('skale');
    this.depositBoxAddress =
      blockchainConfig['skale'].deposit_box_erc20_address;
    this.depositBoxAbi = blockchainConfig['skale'].deposit_box_erc20_abi;
    this.rpcUrl = skaleConfig['rpc_url'];
    this.skaleChainName = skaleConfig['chain_name'];
    this.chainIds.skale = skaleConfig['chain_id_hex'];

    // init provider
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  public async getMainnetTokenBalance() {
    const currentWalletAddress = await this.provider.getSigner().getAddress();

    const mindsToken = new ethers.Contract(
      this.web3Wallet.config.token.address,
      this.web3Wallet.config.token.abi,
      this.provider.getSigner()
    );

    return mindsToken.balanceOf(currentWalletAddress);
  }

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
  withdraw = () => void 0;

  /**
   * SKALE: 0x466ec1d61bcef
   * Rinekby: 0x4
   */
  private async switchNetwork(chainId: string = '0x4') {
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
            params: [{ chainId: chainId, rpcUrl: this.rpcUrl }],
          });
          window.location.reload();
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }

  public switchNetworkRinkeby(): Promise<void> {
    return this.switchNetwork(this.chainIds.rinkeby);
  }

  public switchNetworkSkale(): Promise<void> {
    return this.switchNetwork(this.chainIds.skale);
  }
}
