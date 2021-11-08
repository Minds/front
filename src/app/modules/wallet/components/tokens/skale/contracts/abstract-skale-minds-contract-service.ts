import { Contract } from '@ethersproject/contracts';
import { ConfigsService } from '../../../../../../common/services/configs.service';
import { NetworkSwitchService } from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';

/**
 * Abstract contract for interactions between SKALE and Mainnet for the MINDS and skMINDS tokens.
 */
export abstract class AbstractSkaleMindsContractService {
  // blockchain specific config.
  protected blockchainConfig: {} = null;

  // SKALE config.
  protected skaleConfig: {} = null;

  constructor(
    protected web3Wallet: Web3WalletService,
    protected config: ConfigsService,
    protected networkSwitch: NetworkSwitchService
  ) {
    this.blockchainConfig = config.get('blockchain');
    this.skaleConfig = config.get('skale');
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
   * Whether the current network is SKALE.
   * @returns { boolean } - true if on SKALE network, false otherwise.
   */
  protected isOnSkaleNetwork(): boolean {
    return this.networkSwitch.isOnNetwork(this.networkSwitch.networks.skale.id);
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
