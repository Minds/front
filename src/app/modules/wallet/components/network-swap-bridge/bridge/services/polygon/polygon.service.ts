import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../../../common/services/network-switch-service';
import { MindsTokenMainnetSignedContractService } from '../../../skale/contracts/minds-token-mainnet-signed-contract.service';
import { BigNumber, ethers } from 'ethers';
import {
  ITransactionWriteResult,
  Log_Event_Signature,
  POSClient,
  setProofApi,
  use,
} from '@maticnetwork/maticjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';
import { providers } from '@0xsequence/multicall';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { PolygonMindsTokenContractService } from './contracts/minds-token-polygon.service';
import {
  BridgeService,
  DepositRecord,
  HistoryRecord,
  RecordStatus,
  RecordType,
  WithdrawRecord,
} from '../../constants/constants.types';

use(Web3ClientPlugin);
setProofApi('https://apis.matic.network/');

@Injectable({ providedIn: 'root' })
export class PolygonService implements BridgeService {
  public history$ = new BehaviorSubject<HistoryRecord[]>([]);
  public historyLoading$ = new BehaviorSubject(false);
  public isLoading$ = new BehaviorSubject(false);
  public hasError$ = new BehaviorSubject(false);

  public userConfig;

  public constants;
  public MAINNET_PROVIDER: ethers.providers.JsonRpcProvider;
  public POLYGON_PROVIDER: ethers.providers.JsonRpcProvider;

  public FROM_POLYGON_BLOCK;
  public FROM_MAINNET_BLOCK;
  public MAINNET_CHAIN_ID;
  public MAINNET_RPC_URL;
  public POLYGON_CHAIN_ID;
  public POLYGON_RPC_URL;
  public MIND_TOKEN_ADDRESS;
  public MIND_CHILD_TOKEN_ADDRESS;
  public ERC20_PREDICATE_ADDRESS;
  public ADDRESS_ZERO;
  public ERC20_ABI;
  public ERC20_PREDICATE_ABI;
  public ROOT_CHAIN_MANAGER_ABI;
  public ROOT_CHAIN_ABI;

  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private mindsToken: MindsTokenMainnetSignedContractService,
    private maticService: PolygonMindsTokenContractService,
    config: ConfigsService
  ) {
    this.userConfig = config.get('user');
    this.constants = config.get('blockchain').polygon.constants;

    this.FROM_POLYGON_BLOCK = this.constants.FROM_POLYGON_BLOCK;
    this.FROM_MAINNET_BLOCK = this.constants.FROM_MAINNET_BLOCK;
    this.MAINNET_CHAIN_ID = this.constants.MAINNET_CHAIN_ID;
    this.MAINNET_RPC_URL = this.constants.MAINNET_RPC_URL;
    this.POLYGON_CHAIN_ID = this.constants.POLYGON_CHAIN_ID;
    this.POLYGON_RPC_URL = this.constants.POLYGON_RPC_URL;
    this.MIND_TOKEN_ADDRESS = this.constants.MIND_TOKEN_ADDRESS;
    this.MIND_CHILD_TOKEN_ADDRESS = this.constants.MIND_CHILD_TOKEN_ADDRESS;
    this.ERC20_PREDICATE_ADDRESS = this.constants.ERC20_PREDICATE_ADDRESS;
    this.ADDRESS_ZERO = this.constants.ADDRESS_ZERO;
    this.ERC20_ABI = this.constants.ERC20_ABI;
    this.ERC20_PREDICATE_ABI = this.constants.ERC20_PREDICATE_ABI;
    this.ROOT_CHAIN_MANAGER_ABI = this.constants.ROOT_CHAIN_MANAGER_ABI;
    this.ROOT_CHAIN_ABI = this.constants.ROOT_CHAIN_ABI;

    this.MAINNET_PROVIDER = new ethers.providers.JsonRpcProvider(
      this.MAINNET_RPC_URL,
      this.MAINNET_CHAIN_ID
    );

    this.POLYGON_PROVIDER = new ethers.providers.JsonRpcProvider(
      this.POLYGON_RPC_URL,
      this.POLYGON_CHAIN_ID
    );
  }

  public async initialize() {
    this.getHistory();
  }

  public getLoadingState() {
    return this.isLoading$;
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
      this.ROOT_CHAIN_ABI,
      this.MAINNET_PROVIDER
    );
    const block: BigNumber = await rootChainContract.getLastChildBlock();
    return block.toNumber();
  }

  /**
   * Approve the spend of X tokens.
   * @param { number } amount - amount of tokens to approve.
   * @returns { Promise<void> }
   */
  public async approve(amount?: BigNumber): Promise<void> {
    const posClient = await this.getPOSClientRoot();
    const erc20Contract = posClient.erc20(this.MIND_TOKEN_ADDRESS, true);
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
  public async deposit(amount: BigNumber): Promise<void> {
    if (amount.isZero()) {
      this.toast.warn('You must provide an amount of tokens');
      return;
    }

    const posClient = await this.getPOSClientRoot();

    const signer = this.web3Wallet.getSigner();
    const userAddress = await signer.getAddress();

    this.isLoading$.next(true);

    try {
      const tx = await posClient
        .erc20(this.MIND_TOKEN_ADDRESS, true)
        .deposit(amount.toString(), userAddress);
      const receipt = await tx.getReceipt();
      const record: DepositRecord = {
        type: RecordType.DEPOSIT,
        status: RecordStatus.SUCCESS,
        amount: amount.toString(),
        txBlock: receipt.blockNumber,
        txHash: receipt.transactionHash,
      };
      this.addToHistory(record);
      this.isLoading$.next(false);
    } catch (e) {
      if (e.code === 4001) {
        this.hasError$.next(true);
      }
      this.isLoading$.next(false);
      throw e;
    }
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
      this.MIND_CHILD_TOKEN_ADDRESS,
      false
    );
    this.isLoading$.next(true);
    try {
      const tx = await erc20ChildToken.withdrawStart(amount.toString());
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
      return true;
    } catch (e) {
      console.warn('withdraw error', e);
      if (e.code === 4001) {
        this.hasError$.next(true);
      }
      this.isLoading$.next(false);
    }
    return false;
  }

  public async exit(burnTxHash: string) {
    const posClient = await this.getPOSClientRoot();

    const erc20RootToken = posClient.erc20(this.MIND_TOKEN_ADDRESS, true);
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
    return txReceipt;
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
    const from = this.userConfig.eth_wallet;
    const ERC20PredicateContract = new ethers.Contract(
      this.ERC20_PREDICATE_ADDRESS,
      this.ERC20_PREDICATE_ABI,
      this.MAINNET_PROVIDER
    );
    const depositEvents = await ERC20PredicateContract.queryFilter(
      ERC20PredicateContract.filters.LockedERC20(
        from,
        null,
        this.MIND_TOKEN_ADDRESS
      ),
      this.FROM_MAINNET_BLOCK
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
    const from = this.userConfig.eth_wallet;
    const multicallProvider = new providers.MulticallProvider(
      this.MAINNET_PROVIDER
    );
    const posClient = await this.getPOSClientRoot();
    const lastChildBlock = await this.getLastChildBlock();
    const childTokenContract = new ethers.Contract(
      this.MIND_CHILD_TOKEN_ADDRESS,
      this.ERC20_ABI,
      this.POLYGON_PROVIDER
    );
    const rootTokenContract = new ethers.Contract(
      this.MIND_TOKEN_ADDRESS,
      this.ERC20_ABI,
      this.MAINNET_PROVIDER
    );
    const withdrawalEvents = await childTokenContract.queryFilter(
      childTokenContract.filters.Transfer(from, this.ADDRESS_ZERO),
      this.FROM_POLYGON_BLOCK
    );
    const exitEvents = await rootTokenContract.queryFilter(
      rootTokenContract.filters.Transfer(this.ERC20_PREDICATE_ADDRESS, from),
      this.FROM_MAINNET_BLOCK
    );

    const rootChainManager = new ethers.Contract(
      posClient.client.config.rootChainManager,
      this.ROOT_CHAIN_MANAGER_ABI,
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
      approved: await rootToken.allowance(from, this.ERC20_PREDICATE_ADDRESS),
    };
  }

  private addToHistory(record: HistoryRecord) {
    this.history$.next(this.sortHistory([record, ...this.history$.getValue()]));
  }

  private getTokenContracts() {
    const rootToken = new ethers.Contract(
      this.MIND_TOKEN_ADDRESS,
      this.ERC20_ABI,
      this.MAINNET_PROVIDER
    );
    const childToken = new ethers.Contract(
      this.MIND_CHILD_TOKEN_ADDRESS,
      this.ERC20_ABI,
      this.POLYGON_PROVIDER
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
    await this.checkConnectedNetwork(this.MAINNET_CHAIN_ID);
    return this.getPOSClient(from, signer, this.POLYGON_PROVIDER);
  }

  private async getPOSClientChild() {
    await this.web3Wallet.initializeProvider();
    const signer = this.web3Wallet.getSigner();
    const from = await signer.getAddress();
    await this.checkConnectedNetwork(this.POLYGON_CHAIN_ID);
    return this.getPOSClient(from, this.POLYGON_PROVIDER, signer);
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
      params: [{ chainId: this.chainIdPrefix(chainId) }],
    });
  }

  private chainIdPrefix(chainId: number) {
    let hex = BigNumber.from(chainId)
      .toHexString()
      .substr(2);
    while (hex.startsWith('0')) {
      hex = hex.substr(1);
    }
    return '0x' + hex;
  }

  private async getPOSClient(
    from: string,
    parentProvider: ethers.providers.JsonRpcProvider | ethers.Signer,
    childProvider: ethers.providers.JsonRpcProvider | ethers.Signer
  ) {
    // @ts-ignore
    const isProd = this.MAINNET_CHAIN_ID === 1;
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
