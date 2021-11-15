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

// map of network data
export interface NetworkMap {
  [key: string]: Network;
}

export type NetworkChainId = string;
export type NetworkName =
  | 'Mainnet'
  | 'SKALE Minds'
  | 'Polygon'
  | 'Goerli'
  | 'Mumbai';
export type NetworkSiteName = 'Mainnet' | 'SKALE' | 'Polygon' | 'Goerli';
export type NetworkDescription = string;
export type NetworkLogoPath = string;
export type NetworkRpcUrl = string;

export type Network = {
  id: NetworkChainId; // chain id (hex).
  networkName: NetworkName; // human readable name for Metamask.
  siteName: NetworkSiteName; // label to be used on-site.
  rpcUrl?: NetworkDescription; // rpc url. nullable for some networks such as mainnet.
  description: NetworkLogoPath; // short description to be used on site.
  logoPath: NetworkRpcUrl; // path to logo file `assets/...`.
  swappable: boolean; // whether swapping is enabled for the network or not.
};

/**
 * Service for the switching of blockchain networks.
 */
@Injectable({ providedIn: 'root' })
export class NetworkSwitchService {
  // network map.
  public networks: NetworkMap = {
    mainnet: {
      id: '',
      siteName: 'Mainnet',
      networkName: 'Mainnet',
      description: 'Main Ethereum Network.',
      logoPath: 'assets/ext/ethereum.png',
      swappable: false,
    },
  };

  // currently active network's chainId - NOT read from web3, should be updated on network switch.
  public activeChainId$: BehaviorSubject<NetworkChainId> = new BehaviorSubject<
    NetworkChainId
  >(null);

  constructor(
    private toast: FormToastService,
    private wallet: Web3WalletService,
    private features: FeaturesService,
    config: ConfigsService
  ) {
    const blockchainConfig = config.get('blockchain');
    const skaleConfig = blockchainConfig['skale'];

    // SKALE
    if (this.features.has('skale') && skaleConfig) {
      this.networks.skale = {
        id: skaleConfig['chain_id_hex'],
        siteName: 'SKALE',
        // Differs to avoid conflict with other SKALE chains.
        networkName: 'SKALE Minds',
        rpcUrl: skaleConfig['rpc_url'],
        description: 'Lightning fast side-chain.',
        logoPath: 'assets/ext/skale.png',
        swappable: true,
      };
    }

    // if (this.features.has('polygon')) {
    // this.networks.polygon = {
    //   id: '0x89',
    //   siteName: 'Polygon',
    //   networkName: 'Polygon',
    //   description: "Ethereum's Internet of Blockchains.",
    //   logoPath: 'assets/ext/polygon.png',
    //   swappable: true,
    // };
    // }

    // if (this.features.has('polygon')) => id of Goerli {
    this.networks.polygon = {
      id: '0x5',
      siteName: 'Polygon',
      networkName: 'Polygon',
      description: "Ethereum's Internet of Blockchains.",
      logoPath: 'assets/ext/polygon.png',
      swappable: true,
    };
    // }

    // Mainnet / Rinkeby
    this.networks.mainnet.id =
      blockchainConfig['client_network'] === 1
        ? '0x1' // mainnet
        : '0x4'; // rinkeby

    // fires async.
    this.initCurrentNetwork();
  }

  /**
   * Calls to switch network.
   * @param { NetworkChainId } chainId - hex of chain id - defaults to mainnet chain id.
   * @returns { Promise<void> }
   */
  public async switch(
    chainId: NetworkChainId = this.networks.mainnet.id
  ): Promise<void> {
    if (!this.wallet.isMetaMask()) {
      this.toast.warn(
        'Network switching is only currently enabled for Metamask'
      );
      return;
    }

    if (chainId === this.wallet.getCurrentChainId()) {
      this.toast.warn('Already on this network');
      return;
    }

    const networkData = this.getNetworkDataById(chainId);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],
      });
      // window.location.reload();
      this.activeChainId$.next(chainId);
    } catch (switchError) {
      const rpcUrl = networkData.rpcUrl ?? false;
      const networkName = networkData.networkName ?? false;

      // network has not yet been added to MetaMask and we have params to add it.
      if (switchError.code === 4902 && rpcUrl && networkName) {
        try {
          const params: AddEthereumChainParameter = {
            chainId: chainId,
            chainName: networkName,
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
   * Gets network data by id.
   * @param { NetworkChainId } id - chainId of the network data to get.
   * @returns { Chain } - network data with matching chainId.
   */
  public getNetworkDataById(id: NetworkChainId): Network {
    const networksArray = Object.entries(this.networks);
    for (let network of networksArray) {
      if (network[1].id === id) {
        return network[1];
      }
    }
    throw new Error('Unknown network chain id.');
  }

  /**
   * Gets currently active network's data using currently activeChainId$.
   * @returns { Observable<Network> } - network data with matching chain id.
   */
  public getActiveNetwork$(): Observable<Network> {
    return this.activeChainId$.pipe(
      map(activeChainId => this.getNetworkDataById(activeChainId)),
      catchError(e => EMPTY)
    );
  }

  /**
   * Gets all networks with swap functionality enabled.
   * @param { Network[] } - networks with swap functionality enabled.
   */
  public getSwappableNetworks(): Network[] {
    const enabledNetworks = Object.entries(this.networks);
    const swappableNetworks = [];
    for (let chain of enabledNetworks) {
      if (chain[1].swappable) {
        swappableNetworks.push(chain[1]);
      }
    }
    return swappableNetworks;
  }

  public isOnNetwork(chainId: NetworkChainId) {
    const activeChainId = this.activeChainId$.getValue();
    return activeChainId === chainId;
  }

  /**
   * Checks which network we are currently on and updates local chainId value.
   * @param { Promise<void> }
   */
  private async initCurrentNetwork(): Promise<void> {
    const chainId: string = this.wallet.getCurrentChainId();
    this.activeChainId$.next(chainId);
  }
}
