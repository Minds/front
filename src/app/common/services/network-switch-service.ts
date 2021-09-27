import { Injectable } from '@angular/core';
import { FormToastService } from './form-toast.service';
import { ConfigsService } from './configs.service';
import { Provider } from '@ethersproject/abstract-provider';

// Interface for adding new Ethereum chains
export interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls?: string[];
  chainName?: string;
  iconUrls?: string[];
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls?: string[];
}

/**
 * Service for the switching of blockchain networks.
 */
@Injectable({ providedIn: 'root' })
export class NetworkSwitchService {
  // chain ids used (hex)
  private chainIds = {
    skale: '',
    mainnet: '',
  };

  constructor(private toast: FormToastService, config: ConfigsService) {
    const skaleConfig = config.get('skale');

    this.chainIds.skale = skaleConfig['chain_id_hex'];
    this.chainIds.mainnet =
      config.get('environment') === 'development'
        ? '0x4' // rinkeby
        : '0x1'; // mainnet
  }

  /**
   * Call to switch to SKALE chain.
   * @param { Provider } provider - provider to use for switching.
   * @returns { Promise<void> }
   */
  public async switchToSkale(
    provider: Provider,
    rpcUrl: string = ''
  ): Promise<void> {
    await this.switch(this.chainIds.skale, provider, 'SKALE Minds', rpcUrl);
  }

  /**
   * Call to switch to mainnet / rinkeby.
   * @param { Provider } provider - provider to use for switching.
   * @returns { Promise<void> }
   */
  public async switchToMainnet(provider: Provider): Promise<void> {
    await this.switch(this.chainIds.mainnet, provider);
  }

  /**
   * Calls to switch network. Encapsulation to be kept private
   * to prevent this from being called with unsupported networks.
   * @param { string } - hex of chain id - defaults to mainnet chain id.
   * @param { Provider } - Ethereum provider.
   * @param { string } - optional - SKALE chain name for if we need to add a new network.
   * @param { string } - optional - RPC URL to add in the event the token is not already in the wallet.
   * @returns { Promise<void> }
   */
  private async switch(
    chainId: string = this.chainIds.mainnet,
    provider: Provider,
    chainName: string = '',
    rpcUrl: string = ''
  ): Promise<void> {
    const currentChainId = await this.getChainId(provider);

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
      if (switchError.code === 4902 && rpcUrl && chainName) {
        try {
          const params: AddEthereumChainParameter = {
            chainId: chainId,
            chainName: chainName,
            rpcUrls: [rpcUrl],
          };
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
          window.location.reload();
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }

  /**
   * Gets current chain ID as a number.
   * @returns { number } current chain id.
   */
  public async getChainId(provider: Provider): Promise<number> {
    const { chainId } = await provider.getNetwork();
    return chainId;
  }

  /**
   * Is on SKALE network.
   * @returns { Promise<boolean> }
   */
  public async isOnSkaleNetwork(provider: Provider): Promise<boolean> {
    const chainId = await this.getChainId(provider);
    return chainId === parseInt(this.chainIds.skale, 16);
  }

  /**
   * Is on mainnet / rinkeby.
   * @returns { Promise<boolean> }
   */
  public async isOnMainnet(provider: Provider): Promise<boolean> {
    const chainId = await this.getChainId(provider);
    return chainId === parseInt(this.chainIds.mainnet, 16);
  }
}
