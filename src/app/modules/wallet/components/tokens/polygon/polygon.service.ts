import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';
import { PolygonMindsTokenContractService } from './contracts/minds-token-polygon.service';
import { MindsTokenMainnetSignedContractService } from '../../network-swap-bridge/skale/contracts/minds-token-mainnet-signed-contract.service';
import { BigNumber, ethers } from 'ethers';
import {
  Log_Event_Signature,
  POSClient,
  setProofApi,
  use,
} from '@maticnetwork/maticjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import {
  DepositRecord,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from './polygon.types';
import { providers } from '@0xsequence/multicall';
import { JsonRpcProviderMemoize } from './utils/JsonUrlProviderMemoize';

const MAINNET_RPC_URL =
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const POLYGON_RPC_URL = 'https://rpc-endpoints.superfluid.dev/mumbai';

const FROM_POLYGON_BLOCK = 22642885;
const FROM_MAINNET_BLOCK = 5946883;

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
const MIND_TOKEN_ADDRESS = '0x8bda9f5c33fbcb04ea176ea5bc1f5102e934257f';
const MIND_CHILD_TOKEN_ADDRESS = '0x22E993D9108DbDe9F32553C3fD0A404aCD2B7150';

const ERC20_PREDICATE_ADDRESS = '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34';
const ERC20_PREDICATE_ABI = [
  'event LockedERC20(address indexed depositor, address indexed depositReceiver, address indexed rootToken, uint256 amount)',
];
const ROOT_CHAIN_MANAGER_ABI = [
  'function depositFor(address user, address rootToken, bytes depositData)',
  'function exit(bytes inputData)',
  'function processedExits(bytes32) view returns (bool)',
  'function tokenToType(address) view returns (bytes32)',
  'function typeToPredicate(bytes32) view returns (address)',
];

const ERC20_ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address account) view returns (uint256)',
  'function allowance(address owner, address spender) view returns (uint256)',
];

use(Web3ClientPlugin);
setProofApi('https://apis.matic.network/');

// console.dir(
//   JSON.stringify(
//     new ethers.utils.Interface().fragments.map(f => f.format('full'))
//   )
// );
const MAINNET_CHAIN_ID = 5;
const POLYGON_CHAIN_ID = 80001;
const MAINNET_PROVIDER = new JsonRpcProviderMemoize(
  MAINNET_RPC_URL,
  MAINNET_CHAIN_ID
);
const POLYGON_PROVIDER = new JsonRpcProviderMemoize(
  POLYGON_RPC_URL,
  POLYGON_CHAIN_ID
);

@Injectable({ providedIn: 'root' })
export class PolygonService {
  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private mindsToken: MindsTokenMainnetSignedContractService,
    private maticService: PolygonMindsTokenContractService
  ) {}

  // private getWithdrawStatus = memoize(
  //   async (
  //     withdraw,
  //     posClient: POSClient,
  //     rootChainManager: ethers.Contract
  //   ): Promise<RecordStatus> => {
  //     const { txBurn, status: _status } = withdraw;
  //     try {
  //       const exitHash = await posClient.exitUtil.getExitHash(
  //         txBurn,
  //         Log_Event_Signature.Erc20Transfer
  //       );
  //       const hasExited = await rootChainManager.processedExits(exitHash);
  //       if (hasExited) {
  //         return RecordStatus.SUCCESS;
  //       }
  //       return _status;
  //     } catch (err) {
  //       console.warn('error determining status', err);
  //     }
  //     return RecordStatus.UNKNOWN;
  //   },
  //   withdraw => withdraw.txBurn
  // );

  public async initialize() {
    await this.web3Wallet.initializeProvider();
  }

  /**
   * Reinitialize wallet by resetting then initializing.
   * @returns { Promise<void> }
   */
  public async reinitializeWallet(): Promise<void> {
    this.web3Wallet.resetProvider();
    await this.web3Wallet.initializeProvider();
  }

  /**
   * Calls to switch network to mainnet / rinkeby.
   * @returns { Promise<void> }
   */
  public async switchNetworkMainnet(): Promise<void> {
    await this.networkSwitch.switch(this.networkSwitch.networks.goerli.id);
    await this.reinitializeWallet();
  }

  /**
   * Calls to switch network to Polygon.
   * @returns { Promise<void> }
   */
  public async switchNetworkPolygon(): Promise<void> {
    await this.networkSwitch.switch(this.networkSwitch.networks.mumbai.id);
    await this.reinitializeWallet();
  }

  /**
   * Is on POLYGON network.
   * @returns { Promise<boolean> }
   */
  public isOnPolygonNetwork(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.mumbai.id
    );
  }

  /**
   * Is on mainnet / rinkeby.
   * @returns { Promise<boolean> }
   */
  public isOnMainnet(): boolean {
    return this.networkSwitch.isOnNetwork(
      this.networkSwitch.networks.goerli.id
    );
  }

  /**
   * Gets mainnet token balance.
   * @returns { Promise<number> }
   */
  public async getMainnetTokenBalance(): Promise<number> {
    return this.mindsToken.balanceOf();
  }

  /**
   * Gets MATIC  token balance.
   * @returns { Promise<number> }
   */
  public async getMaticTokenBalance(): Promise<number> {
    return this.maticService.getPolygonTokenBalance();
  }

  /**
   * Gets MATIC  token allowance.
   * @returns { Promise<number> }
   */
  public async getPolygonTokenAllowance(): Promise<number> {
    return this.maticService.getPolygonTokenAllowance();
  }

  public async increasePolygonTokenAllowance(amount): Promise<number> {
    return this.maticService.increasePolygonTokenAllowance(amount);
  }

  /**
   * Approve the spend of X tokens.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approve(amount?: BigNumber): Promise<any> {
    if (amount && amount.isZero()) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const posClient = await this.getPOSClientRoot();
    const erc20Contract = posClient.erc20(MIND_TOKEN_ADDRESS);

    const approveTx = await erc20Contract.approveMax();
    console.log(approveTx);
    const receipt = await approveTx.getReceipt();
    console.log('receipt', receipt);
  }

  /**
   * Deposit the spend of X tokens.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async deposit(amount: BigNumber): Promise<any> {
    if (amount.isZero()) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const signer = this.web3Wallet.getSigner();
    const userAddress = await signer.getAddress();
    const posClient = await this.getPOSClientRoot();

    const depositTx = await posClient
      .erc20(MIND_TOKEN_ADDRESS)
      .deposit(amount.toString(), userAddress);
    await depositTx.getReceipt();
  }

  /**
   * Withdraw token from Polygon to Mainnet.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async withdraw(amount: BigNumber): Promise<any> {
    if (amount.isZero()) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const posClientChild = await this.getPOSClientChild();

    const erc20ChildToken = posClientChild.erc20(
      MIND_CHILD_TOKEN_ADDRESS,
      false
    );
    const withdrawTx = await erc20ChildToken.withdrawStart(amount.toString());
    const withdrawReceipt = await withdrawTx.getReceipt();

    console.log('withdrawReceipt', withdrawReceipt);
  }

  public async exit(burnTxHash: string) {
    const posClient = await this.getPOSClientRoot();

    const erc20RootToken = posClient.erc20(MIND_TOKEN_ADDRESS, true);
    const result = await erc20RootToken.withdrawExitFaster(burnTxHash);
    console.log('result', result);

    const txHash = await result.getTransactionHash();
    console.log('txHash', txHash);

    const txReceipt = await result.getReceipt();
    console.log('txReceipt', txReceipt);
  }

  public async getHistory() {
    const [deposits, withdrawals] = await Promise.all([
      this.getDepositHistory(),
      this.getWithdrawHistory(),
    ]);
    console.log({ deposits, withdrawals });
  }

  public async getDepositHistory() {
    const from = await this.web3Wallet.provider.getSigner().getAddress();
    const ERC20PredicateContract = new ethers.Contract(
      ERC20_PREDICATE_ADDRESS,
      ERC20_PREDICATE_ABI,
      MAINNET_PROVIDER
    );
    const depositEvents = await ERC20PredicateContract.queryFilter(
      ERC20PredicateContract.filters.LockedERC20(
        from,
        null,
        MIND_TOKEN_ADDRESS
      ),
      FROM_MAINNET_BLOCK
    );
    return depositEvents.map(
      (event): DepositRecord => {
        const args = event.args ?? [];
        const amount: BigNumber = args[3];

        return {
          type: RecordType.DEPOSIT,
          status: RecordStatus.SUCCESS,
          amount: amount.toString(),
          txHash: event.transactionHash,
        };
      }
    );
  }

  public async getWithdrawHistory() {
    const from = await this.web3Wallet.provider.getSigner().getAddress();
    const multicallProvider = new providers.MulticallProvider(MAINNET_PROVIDER);
    const posClient = await this.getPOSClientRoot();
    const childTokenContract = new ethers.Contract(
      MIND_CHILD_TOKEN_ADDRESS,
      ERC20_ABI,
      POLYGON_PROVIDER
    );
    const rootTokenContract = new ethers.Contract(
      MIND_TOKEN_ADDRESS,
      ERC20_ABI,
      MAINNET_PROVIDER
    );
    const withdrawalEvents = await childTokenContract.queryFilter(
      childTokenContract.filters.Transfer(from, ADDRESS_ZERO),
      FROM_POLYGON_BLOCK
    );
    const exitEvents = await rootTokenContract.queryFilter(
      rootTokenContract.filters.Transfer(ERC20_PREDICATE_ADDRESS, from),
      FROM_MAINNET_BLOCK
    );

    const rootChainManager = new ethers.Contract(
      posClient.client.config.rootChainManager,
      ROOT_CHAIN_MANAGER_ABI,
      multicallProvider
    );
    const records = await Promise.all(
      withdrawalEvents.map(
        async (event): Promise<WithdrawRecord> => {
          const amount = event.args.value as BigNumber;
          return {
            type: RecordType.WITHDRAW,
            status: RecordStatus.PENDING,
            amount: amount.toString(),
            txBurn: event.transactionHash,
          };
        }
      )
    );

    const txExitHashesPromises = records.map(async record => {
      const payload = await posClient.exitUtil.buildPayloadForExit(
        record.txBurn,
        Log_Event_Signature.Erc20Transfer,
        true
      );
      const exitTx = await rootChainManager.populateTransaction.exit(payload);
      return { txBurn: record.txBurn, data: exitTx.data };
    });
    const txExitHashes = await Promise.all(txExitHashesPromises);

    const exitTxs = await Promise.all(
      exitEvents.map(async event => {
        const tx = await event.getTransaction();
        const hash = txExitHashes.find(_hash => _hash.data === tx.data);
        return { ...hash, txHash: event.transactionHash };
      })
    );

    return records.map(record => {
      const exitTx = exitTxs.find(_exitTx => _exitTx.txBurn === record.txBurn);
      if (exitTx) {
        return {
          ...record,
          status: RecordStatus.SUCCESS,
          txHash: exitTx.txHash,
        };
      }
      return record;
    });
  }

  public async getBalances() {
    const posClient = await this.getPOSClientRoot();
    const { childToken, rootToken } = this.getTokenContracts();
    const from = await this.web3Wallet.provider.getSigner().getAddress();

    return {
      root: await rootToken.balanceOf(from),
      child: await childToken.balanceOf(from),
      approved: await rootToken.allowance(
        from,
        posClient.client.config.rootChainManager
      ),
    };
  }

  private getTokenContracts() {
    const rootToken = new ethers.Contract(
      MIND_TOKEN_ADDRESS,
      ERC20_ABI,
      MAINNET_PROVIDER
    );
    const childToken = new ethers.Contract(
      MIND_CHILD_TOKEN_ADDRESS,
      ERC20_ABI,
      POLYGON_PROVIDER
    );
    return {
      rootToken,
      childToken,
    };
  }

  private async getPOSClientRoot() {
    const signer = this.web3Wallet.getSigner();
    const network = await signer.provider.getNetwork();
    const provider =
      network.chainId === MAINNET_CHAIN_ID
        ? POLYGON_PROVIDER
        : MAINNET_PROVIDER;

    const from = await signer.getAddress();

    return this.getPOSClient(from, signer, provider);
  }

  private async getPOSClientChild() {
    const signer = this.web3Wallet.getSigner();
    const network = await signer.provider.getNetwork();
    const provider =
      network.chainId === MAINNET_CHAIN_ID
        ? POLYGON_PROVIDER
        : MAINNET_PROVIDER;
    const from = await signer.getAddress();

    return this.getPOSClient(from, provider, signer);
  }

  private async getPOSClient(
    from: string,
    parentProvider: ethers.providers.JsonRpcProvider | ethers.Signer,
    childProvider: ethers.providers.JsonRpcProvider | ethers.Signer
  ) {
    const posClientChild = new POSClient();
    await posClientChild.init({
      log: true,
      network: 'testnet',
      version: 'mumbai',
      parent: { provider: parentProvider, defaultConfig: { from } },
      child: { provider: childProvider, defaultConfig: { from } },
    });
    return posClientChild;
  }
}
