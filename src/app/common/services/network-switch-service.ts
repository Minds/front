import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { FormToastService } from './form-toast.service';
import { ConfigsService } from './configs.service';
import { Web3WalletService } from '../../modules/blockchain/web3-wallet.service';
import { FeaturesService } from '../../services/features.service';
import { BehaviorSubject } from 'rxjs';
import { ethers } from 'ethers';
import { isPlatformBrowser } from '@angular/common';
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
export type NetworkSiteName =
  | 'Mainnet'
  | 'SKALE'
  | 'Polygon'
  | 'Goerli'
  | 'Mumbai';
export type NetworkDescription = string;
export type NetworkLogoPath = string;
export type NetworkRpcUrl = string;

export interface Network {
  id: NetworkChainId; // chain id (hex).
  networkName: NetworkName; // human readable name for Metamask.
  siteName: NetworkSiteName; // label to be used on-site.
  rpcUrl?: NetworkRpcUrl; // rpc url
  description: NetworkDescription; // short description to be used on site.
  logoPath: NetworkLogoPath; // path to logo file `assets/...`.
  swappable: boolean; // whether swapping is enabled for the network or not.
  showHistoric?: boolean; // whether the transaction historical option should be displayed
}

export const UNKNOWN_NETWORK_LOGO_PATH_DARK = 'assets/ext/unknown-dark.png';
export const UNKNOWN_NETWORK_LOGO_PATH_LIGHT = 'assets/ext/unknown-light.png';

/**
 * Service for the switching of blockchain networks.
 */
@Injectable({ providedIn: 'root' })
export class NetworkSwitchService implements OnDestroy {
  public networks: NetworkMap = {};

  // provider with the sole responsibility of listening to network changes.
  private networkChangeProvider: Provider = null;

  // fires on network change
  public readonly networkChanged$ = new BehaviorSubject<number | null>(null);

  ngOnDestroy(): void {
    if (this.networkChangeProvider) {
      this.networkChangeProvider.removeAllListeners();
      this.networkChangeProvider = null;
    }
  }

  constructor(
    private toast: FormToastService,
    private wallet: Web3WalletService,
    private features: FeaturesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    config: ConfigsService
  ) {
    const blockchainConfig = config.get('blockchain');
    const skaleConfig = blockchainConfig['skale'];
    const polygonConfig = blockchainConfig['polygon'];

    // network map.
    this.networks.mainnet = {
      id: polygonConfig['mainnet_rpc_provider'].chain_id,
      rpcUrl: polygonConfig['mainnet_rpc_provider'].url,
      siteName: 'Mainnet',
      networkName: 'Mainnet',
      description: 'Main Ethereum Network.',
      logoPath: 'assets/ext/ethereum.png',
      swappable: false,
    };
    // POLYGON
    if (this.features.has('polygon')) {
      /**
       * TODO:
       * - Enable feature flag in settings.php for testing.
       * - Add RPC URL if needed - else modify switch function - without this network cannot be added.
       * - Pull id from config instead of hardcoding like below so that it can be swapped in settings.php
       *   for testnet / non testnet.
       */
      this.networks.polygon = {
        id: polygonConfig['polygon_rpc_provider'].chain_id,
        rpcUrl: polygonConfig['polygon_rpc_provider'].url,
        siteName: 'Polygon',
        networkName: 'Polygon',
        description:
          'Polygon combines the best of Ethereum and sovereign blockchains into a full-fledged multi-chain system. Typical fee ~ 1% - Transfer ~ 8 mins',
        logoPath: 'assets/ext/polygon_white.svg',
        swappable: true,
        showHistoric: true,
      };
    }

    // SKALE
    if (this.features.has('skale') && skaleConfig) {
      this.networks.skale = {
        id: skaleConfig['chain_id_hex'],
        siteName: 'SKALE',
        // Differs to avoid conflict with other SKALE chains.
        networkName: 'SKALE Minds',
        rpcUrl: skaleConfig['rpcUrl'],
        description:
          'What is Skale. What’s its value. Why should I use is. Who is it suited for. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum at feugiat diam.',
        logoPath: 'assets/ext/skale_white.svg',
        swappable: true,
        showHistoric: false,
      };
    }

    // Mainnet / Goerli
    this.networks.mainnet.id =
      blockchainConfig['client_network'] === 1
        ? '0x1' // mainnet
        : '0x5'; // rinkeby

    this.setupNetworkChangeListener();
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
    } catch (switchError) {
      const rpcUrl = networkData.rpcUrl ?? false;
      const networkName = networkData.networkName ?? false;

      console.log(switchError);
      console.log(networkName);
      // network has not yet been added to MetaMask and we have params to add it.
      if (switchError.code === 4902 && rpcUrl && networkName) {
        try {
          console.log(chainId);
          const params: AddEthereumChainParameter = {
            chainId: chainId,
            chainName: networkName,
            rpcUrls: [rpcUrl],
          };
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [params],
          });
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
    for (const network of networksArray) {
      if (network[1].id === id) {
        return network[1];
      }
    }
    return null;
  }

  /**
   * Gets currently active network's data using currently activeChainId$.
   * @returns { Network } - network data with matching chain id.
   */
  public getActiveNetwork(): Network {
    return this.getNetworkDataById(this.wallet.getCurrentChainId());
  }

  /**
   * Gets all networks with swap functionality enabled.
   * @returns { Network[] } - networks with swap functionality enabled.
   */
  public getSwappableNetworks(): Network[] {
    const enabledNetworks = Object.entries(this.networks);
    const swappableNetworks = [];
    for (const chain of enabledNetworks) {
      if (chain[1].swappable) {
        swappableNetworks.push(chain[1]);
      }
    }
    return swappableNetworks;
  }

  /**
   * True if provider currently is on network passed in as param.
   * @param { NetworkChainId } chainId - chain id of network to check.
   * @returns { boolean } - whether user is on network or not.
   */
  public isOnNetwork(chainId: NetworkChainId): boolean {
    const activeChainId = this.wallet.getCurrentChainId();
    return activeChainId === chainId;
  }

  /**
   * Sets up network change listener. - will respond to change by reinitializing provider
   * and pushing new network to networkChanged$ BehaviorSubject.
   * @returns { void }
   */
  private setupNetworkChangeListener(): void {
    if (isPlatformBrowser(this.platformId) && window.ethereum) {
      this.networkChangeProvider = new ethers.providers.Web3Provider(
        window.ethereum,
        'any'
      );
      this.networkChangeProvider.getNetwork().then(network => {
        this.networkChanged$.next(network.chainId);
      });
      window.ethereum.on('networkChanged', async chain => {
        this.networkChanged$.next(ethers.BigNumber.from(chain).toNumber());
        if (this.networkChanged$.value) {
          await this.wallet.reinitializeProvider();
        }
      });
    }
  }
}
