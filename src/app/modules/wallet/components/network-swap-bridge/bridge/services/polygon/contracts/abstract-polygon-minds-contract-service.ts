import { Contract } from '@ethersproject/contracts';
import { ConfigsService } from '../../../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../../../blockchain/web3-wallet.service';

/**
 * Abstract contract for interactions between Polygon and Mainnet for the MINDS and skMINDS tokens.
 */
export abstract class AbstractPolygonMindsContractService {
  // blockchain specific config.
  protected polygonConfig = null;

  protected polygonAbi = null;

  protected polygonChildAbi = null;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    // has to be changed to config.get('blockchain').polygon.polygon_contracts_mainnet for mainnet
    this.polygonConfig = config.get(
      'blockchain'
    ).polygon.polygon_contracts_mumbai;
    this.polygonAbi = config.get(
      'blockchain'
    ).polygon.polygon_contracts_root_chain;
    this.polygonChildAbi = config.get(
      'blockchain'
    ).polygon.polygon_contracts_child_chain;
  }

  /**
   * Should return the Contract instance for a the extending contract service.
   * @returns { Contract } - Contract instance.
   */
  abstract getContract(): Contract;

  /**
   * Gets current wallet address.
   * @returns { string } - current wallet address.
   */
  protected async getWalletAddress(): Promise<string> {
    await this.web3Wallet.initializeProvider();
    const walletAddress = await this.web3Wallet.getCurrentWallet();
    return walletAddress ? walletAddress : '';
  }

  /**
   * Whether the current network is Polygon.
   * @returns { boolean } - true if on Polygon network, false otherwise.
   */
  protected isOnPolygonNetwork(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.polygon.id
    );
  }

  /**
   * Whether the current network is Mainnet.
   * @returns { boolean } - true if on Mainnet network, false otherwise.
   */
  protected isOnMainnet(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.mainnet.id
    );
  }
}
