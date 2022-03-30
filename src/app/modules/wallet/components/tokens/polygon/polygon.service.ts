import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';
import { PolygonMindsTokenContractService } from './contracts/minds-token-polygon.service';
import { MindsTokenMainnetSignedContractService } from '../../network-swap-bridge/skale/contracts/minds-token-mainnet-signed-contract.service';
import { BigNumber, ethers } from 'ethers';
import {
  ITransactionWriteResult,
  Log_Event_Signature,
  POSClient,
  setProofApi,
  use,
} from '@maticnetwork/maticjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import {
  DepositRecord,
  HistoryRecord,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from './polygon.types';
import { providers } from '@0xsequence/multicall';
import { JsonRpcProviderMemoize } from './utils/JsonUrlProviderMemoize';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../../../common/services/configs.service';

const MAINNET_RPC_URL =
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const POLYGON_RPC_URL = 'https://rpc-endpoints.superfluid.dev/mumbai';

const FROM_POLYGON_BLOCK = 22642885;
const FROM_MAINNET_BLOCK = 5946883;

const MAINNET_CHAIN_ID = 5;
const POLYGON_CHAIN_ID = 80001;

const MIND_TOKEN_ADDRESS = '0x8bda9f5c33fbcb04ea176ea5bc1f5102e934257f'; // Goerli
const MIND_CHILD_TOKEN_ADDRESS = '0x22E993D9108DbDe9F32553C3fD0A404aCD2B7150'; // Mumbai
const ERC20_PREDICATE_ADDRESS = '0xdD6596F2029e6233DEFfaCa316e6A95217d4Dc34';

const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';
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

const ROOT_CHAIN_ABI = [
  'function currentHeaderBlock() view returns (uint256)',
  'function getLastChildBlock() view returns (uint256)',
];

use(Web3ClientPlugin);
setProofApi('https://apis.matic.network/');

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
  public history$ = new BehaviorSubject<HistoryRecord[]>([]);
  public historyLoading$ = new BehaviorSubject(false);

  public isLoading$ = new BehaviorSubject(false);

  public hasError$ = new BehaviorSubject(false);

  public userConfig;

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private mindsToken: MindsTokenMainnetSignedContractService,
    private maticService: PolygonMindsTokenContractService,
    config: ConfigsService
  ) {
    this.userConfig = config.get('user');
  }

  public async initialize() {
    await this.web3Wallet.initializeProvider();
    this.web3Wallet.provider$.subscribe(async provider => {
      const network = await provider.getNetwork();
      if (network.chainId === 5) {
        this.getHistory();
      }
    });
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

  public async getLastChildBlock() {
    const posClient = await this.getPOSClientRoot();
    const rootChainContract = new ethers.Contract(
      posClient.client.config.rootChain,
      ROOT_CHAIN_ABI,
      MAINNET_PROVIDER
    );
    const block: BigNumber = await rootChainContract.getLastChildBlock();
    console.log('block', block);
    return block.toNumber();
  }

  /**
   * Approve the spend of X tokens.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approve(amount?: BigNumber): Promise<any> {
    const posClient = await this.getPOSClientRoot();
    const erc20Contract = posClient.erc20(MIND_TOKEN_ADDRESS, true);
    let approveTx: ITransactionWriteResult;
    if (amount) {
      approveTx = await erc20Contract.approve(amount.toString());
    } else {
      approveTx = await erc20Contract.approveMax();
    }
    await approveTx.getReceipt();
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
    this.isLoading$.next(true);
    const posClient = await this.getPOSClientRoot();

    const signer = this.web3Wallet.getSigner();
    const userAddress = await signer.getAddress();

    try {
      const tx = await posClient
        .erc20(MIND_TOKEN_ADDRESS, true)
        .deposit(amount.toString(), userAddress);
      const receipt = await tx.getReceipt();
      const record: DepositRecord = {
        type: RecordType.DEPOSIT,
        status: RecordStatus.SUCCESS,
        amount: amount.toString(),
        txBlock: receipt.blockNumber,
        txHash: receipt.transactionHash,
      };
      console.log('recept', receipt);
      this.addToHistory(record);
      this.isLoading$.next(false);
      console.log(tx);
    } catch (e) {
      if (e.code === 4001) {
        this.hasError$.next(true);
        this.isLoading$.next(false);
      }
    }
  }

  private addToHistory(record: HistoryRecord) {
    this.history$.next(this.sortHistory([record, ...this.history$.getValue()]));
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
    this.isLoading$.next(true);
    const withdrawTx = await erc20ChildToken
      .withdrawStart(amount.toString())
      .then(async tx => {
        const withdrawReceipt = await tx.getReceipt();

        console.log('withdrawReceipt', withdrawReceipt);

        const record: WithdrawRecord = {
          type: RecordType.WITHDRAW,
          status: RecordStatus.PENDING,
          amount: amount.toString(),
          txBurn: withdrawReceipt.transactionHash,
        };
        this.addToHistory(record);
        this.isLoading$.next(false);
      })
      .catch(e => {
        if (e.code === 4001) {
          this.hasError$.next(true);
          this.isLoading$.next(false);
        }
      });
  }

  public async exit(burnTxHash: string) {
    const posClient = await this.getPOSClientRoot();

    const erc20RootToken = posClient.erc20(MIND_TOKEN_ADDRESS, true);
    const result = await erc20RootToken.withdrawExitFaster(burnTxHash);
    const txReceipt = await result.getReceipt();

    const history = this.history$.getValue().map(record => {
      if (record.type === RecordType.WITHDRAW && record.txBurn === burnTxHash) {
        return {
          ...record,
          status: RecordStatus.SUCCESS,
          txBlock: txReceipt.blockNumber,
          txHash: txReceipt.transactionHash,
        };
      }
      return record;
    });
    this.history$.next(history);
  }

  public async getHistory() {
    this.historyLoading$.next(true);
    try {
      const [deposits, withdrawals] = await Promise.all([
        this.getDepositHistory(),
        this.getWithdrawHistory(),
      ]);
      const history: HistoryRecord[] = [...deposits, ...withdrawals];
      this.history$.next(this.sortHistory(history));
    } catch (err) {
      console.warn('error fetching history', err);
    } finally {
      this.historyLoading$.next(false);
    }
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
          txBlock: event.blockNumber,
        };
      }
    );
  }

  public async getWithdrawHistory() {
    const from = await this.web3Wallet.provider.getSigner().getAddress();
    const multicallProvider = new providers.MulticallProvider(MAINNET_PROVIDER);
    const posClient = await this.getPOSClientRoot();
    const lastChildBlock = await this.getLastChildBlock();
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
          const status =
            event.blockNumber < lastChildBlock
              ? RecordStatus.ACTION_REQUIRED
              : RecordStatus.PENDING;
          return {
            status,
            type: RecordType.WITHDRAW,
            amount: amount.toString(),
            txBurn: event.transactionHash,
          };
        }
      )
    );

    const txExitHashesPromises = records.map(async record => {
      try {
        const payload = await posClient.exitUtil.buildPayloadForExit(
          record.txBurn,
          Log_Event_Signature.Erc20Transfer,
          true
        );
        const exitTx = await rootChainManager.populateTransaction.exit(payload);
        return { txBurn: record.txBurn, data: exitTx.data };
      } catch (err) {
        console.warn('error retrieving exit tx', err);
      }
      return null;
    });
    const txExitHashes = (await Promise.all(txExitHashesPromises)).filter(
      tx => tx !== null
    );

    const exitTxs = await Promise.all(
      exitEvents.map(async event => {
        const tx = await event.getTransaction();
        const hash = txExitHashes.find(_hash => _hash.data === tx.data);
        return {
          ...hash,
          txBlock: tx.blockNumber,
          txHash: event.transactionHash,
        };
      })
    );

    return records.map(record => {
      const exitTx = exitTxs.find(_exitTx => _exitTx.txBurn === record.txBurn);
      if (exitTx) {
        return {
          ...record,
          status: RecordStatus.SUCCESS,
          txBlock: exitTx.txBlock,
          txHash: exitTx.txHash,
        };
      }
      return record;
    });
  }

  public async getBalances() {
    const { childToken, rootToken } = this.getTokenContracts();
    const from = this.userConfig.eth_wallet;
    return {
      root: await rootToken.balanceOf(from),
      child: await childToken.balanceOf(from),
      approved: await rootToken.allowance(from, ERC20_PREDICATE_ADDRESS),
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
    await this.web3Wallet.initializeProvider();
    const signer = this.web3Wallet.getSigner();
    const from = await signer.getAddress();
    await this.checkConnectedNetwork(MAINNET_CHAIN_ID);
    return this.getPOSClient(from, signer, POLYGON_PROVIDER);
  }

  private async getPOSClientChild() {
    await this.web3Wallet.initializeProvider();
    const signer = this.web3Wallet.getSigner();
    const from = await signer.getAddress();
    await this.checkConnectedNetwork(POLYGON_CHAIN_ID);
    return this.getPOSClient(from, POLYGON_PROVIDER, signer);
  }

  private async checkConnectedNetwork(chainId: number) {
    const signer = this.web3Wallet.getSigner();
    const network = await signer.provider.getNetwork();
    if (network.chainId === chainId) {
      return;
    }
    if (!window.ethereum) {
      throw new Error('cannot switch network');
    }
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId}` }],
    });
  }

  private async getPOSClient(
    from: string,
    parentProvider: ethers.providers.JsonRpcProvider | ethers.Signer,
    childProvider: ethers.providers.JsonRpcProvider | ethers.Signer
  ) {
    // @ts-ignore
    const isProd = MAINNET_CHAIN_ID === 1;
    const posClient = new POSClient();
    await posClient.init({
      log: !isProd,
      network: isProd ? 'mainnet' : 'testnet',
      version: isProd ? 'v1' : 'mumbai',
      parent: { provider: parentProvider, defaultConfig: { from } },
      child: { provider: childProvider, defaultConfig: { from } },
    });
    return posClient;
  }

  private sortHistory(history: HistoryRecord[]) {
    return history.sort((record1, record2) => {
      if (
        record1.status === RecordStatus.SUCCESS &&
        record2.status === RecordStatus.SUCCESS
      ) {
        return record1.txBlock > record2.txBlock ? -1 : 1;
      } else if (record1.status === RecordStatus.SUCCESS) {
        return 1;
      } else if (record2.status === RecordStatus.SUCCESS) {
        return -1;
      }
      return 0;
    });
  }
}
