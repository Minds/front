import { Injectable } from '@angular/core';
import { FormToastService } from './form-toast.service';
import { ConfigsService } from './configs.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { Web3WalletService } from '../../modules/blockchain/web3-wallet.service';
import { catchError, map } from 'rxjs/operators';
import { FeaturesService } from '../../services/features.service';

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

// map of chain data
export interface ChainMap {
  [key: string]: Chain;
}

export type ChainId = string; // id of chain.
export type ChainName = string; // human readable name of chain.
export type ChainDescription = string; // human readable name of chain.
export type ChainLogoPath = string; // human readable name of chain.
export type ChainRpcUrl = string; // RPC Url for custom chains.

export type Chain = {
  id: ChainId; // chain id (hex).
  networkName: ChainName; // human readable name for Metamask.
  siteName: ChainName; // label to be used on-site.
  rpcUrl?: ChainDescription; // rpc url. nullable for some networks such as mainnet.
  description: ChainLogoPath; // short description to be used on site.
  logoPath: ChainRpcUrl; // path to logo file `assets/...`.
};

/**
 * Service for the switching of blockchain networks / chains.
 */
@Injectable({ providedIn: 'root' })
export class NetworkSwitchService {
  // chain map with hex IDs used (hex)
  public chains: ChainMap = {
    mainnet: {
      id: '',
      siteName: 'Mainnet',
      networkName: 'Mainnet',
      description: 'Main Ethereum Network.',
      logoPath: 'assets/ext/ethereum.png',
    },
  };

  // currently active chain - NOT read from network, should be updated on Network switch.
  public activeChainId$: BehaviorSubject<ChainId> = new BehaviorSubject<
    ChainId
  >(null);

  constructor(
    private toast: FormToastService,
    private wallet: Web3WalletService,
    private features: FeaturesService,
    config: ConfigsService
  ) {
    const skaleConfig = config.get('skale');
    const blockchainConfig = config.get('blockchain');

    // SKALE
    if (this.features.has('skale') && skaleConfig) {
      this.chains.skale = {
        id: skaleConfig['chain_id_hex'],
        siteName: 'SKALE',
        // Differs to avoid conflict with other SKALE chains.
        networkName: 'SKALE Minds',
        rpcUrl: skaleConfig['rpc_url'],
        description: 'Lightning fast decentralized side-chain.',
        logoPath: 'assets/ext/skale.png',
      };
    }

    // Mainnet / Rinkeby
    this.chains.mainnet.id =
      blockchainConfig['client_network'] === 1
        ? '0x1' // mainnet
        : '0x4'; // rinkeby

    // fires async.
    this.initCurrentChain();
  }

  /**
   * Calls to switch network.
   * @param { string } - hex of chain id - defaults to mainnet chain id.
   * @returns { Promise<void> }
   */
  public async switch(chainId: string = this.chains.mainnet.id): Promise<void> {
    // Reset the provider here as we will be invalidating currently set network.
    // Alternative is to run a window.location.reload().
    this.wallet.resetProvider();

    const currentChainId = await this.wallet.getCurrentChainId();

    if (!this.wallet.isMetaMask()) {
      this.toast.warn(
        'Network switching is only currently enabled for Metamask'
      );
      return;
    }

    if (parseInt(chainId, 16) === currentChainId) {
      this.toast.warn('Already on this network');
      return;
    }

    const chainData = this.getChainDataById(chainId);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      // window.location.reload();
      this.activeChainId$.next(chainId);
    } catch (switchError) {
      const rpcUrl = chainData.rpcUrl ?? false;
      const chainName = chainData.networkName ?? false;

      // chain has not yet been added to MetaMask and we have params to add it.
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
          // window.location.reload();
          this.activeChainId$.next(chainId);
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  }

  /**
   * Gets chain data by id.
   * @param { ChainId } id - id of the chain data to get.
   * @returns { Chain } - chain data with matching id.
   */
  public getChainDataById(id: ChainId): Chain {
    const chainsArray = Object.entries(this.chains);
    for (let chain of chainsArray) {
      if (chain[1].id === id) {
        return chain[1];
      }
    }
    throw new Error('Unknown chain id.');
  }

  /**
   * Gets currently active chain's data using currently activeChainId$ BehaviorSubject.
   * @returns { Chain } - chain data with matching id.
   */
  public getActiveChain$(): Observable<Chain> {
    return this.activeChainId$.pipe(
      map(activeChainId => this.getChainDataById(activeChainId)),
      catchError(e => EMPTY)
    );
  }

  /**
   * Checks which chain we are currently on and updates local value -
   * WILL prompt for wallet connection.
   * @param { Promise<void> }
   */
  private async initCurrentChain(): Promise<void> {
    const chainId: number = await this.wallet.getCurrentChainId();
    this.activeChainId$.next(`0x${chainId.toString(16)}`);
  }
}
