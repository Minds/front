import { Injectable } from '@angular/core';
import { FormToastService } from '../../../../../common/services/form-toast.service';
import { Web3WalletService } from '../../../../blockchain/web3-wallet.service';
import { NetworkSwitchService } from '../../../../../common/services/network-switch-service';
import { PolygonMindsTokenContractService } from './contracts/minds-token-polygon.service';
import { MindsTokenMainnetSignedContractService } from '../../network-swap-bridge/skale/contracts/minds-token-mainnet-signed-contract.service';
import { BigNumber, ethers } from 'ethers';
import { POSClient, setProofApi, use } from '@maticnetwork/maticjs';
import { Web3ClientPlugin } from '@maticnetwork/maticjs-ethers';

const MAINNET_RPC_URL =
  'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161';
const POLYGON_RPC_URL = 'https://rpc-mumbai.maticvigil.com';

const MIND_TOKEN_ADDRESS = '0x8bda9f5c33fbcb04ea176ea5bc1f5102e934257f';
const MIND_CHILD_TOKEN_ADDRESS = '0x22E993D9108DbDe9F32553C3fD0A404aCD2B7150';

use(Web3ClientPlugin);
setProofApi('https://apis.matic.network/');

@Injectable({ providedIn: 'root' })
export class PolygonService {
  constructor(
    private toast: FormToastService,
    private web3Wallet: Web3WalletService,
    private networkSwitch: NetworkSwitchService,
    private mindsToken: MindsTokenMainnetSignedContractService,
    private maticService: PolygonMindsTokenContractService
  ) {}

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

    const approveTx = await posClient.erc20(MIND_TOKEN_ADDRESS).approveMax();
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

  public async exit() {
    const posClient = await this.getPOSClientRoot();

    const burnTxHash =
      '0x0c87414cd8ddc442450cee5ee655c15754c2636a4098d6b45b89747f452bdb68';

    const erc20RootToken = posClient.erc20(MIND_TOKEN_ADDRESS, true);
    const result = await erc20RootToken.withdrawExitFaster(burnTxHash);
    console.log('result', result);

    const txHash = await result.getTransactionHash();
    console.log('txHash', txHash);

    const txReceipt = await result.getReceipt();
    console.log('txReceipt', txReceipt);
  }

  public async getBalances() {
    const from = await this.web3Wallet.provider.getSigner().getAddress();

    const providerMainnet = new ethers.providers.JsonRpcProvider(
      MAINNET_RPC_URL,
      5
    );
    const providerPolygon = new ethers.providers.JsonRpcProvider(
      POLYGON_RPC_URL,
      80001
    );
    const erc20_abi = [
      'function balanceOf(address account) view returns (uint256)',
      'function allowance(address owner, address spender) view returns (uint256)',
    ];
    const rootToken = new ethers.Contract(
      MIND_TOKEN_ADDRESS,
      erc20_abi,
      providerMainnet
    );
    const childToken = new ethers.Contract(
      MIND_CHILD_TOKEN_ADDRESS,
      erc20_abi,
      providerPolygon
    );

    const posClient = await this.getPOSClientRoot();
    const rootChainManager = await posClient.rootChainManager.getContract();

    return {
      root: await rootToken.balanceOf(from),
      child: await childToken.balanceOf(from),
      approved: await rootToken.allowance(from, rootChainManager.address),
    };
  }

  private async getPOSClientRoot() {
    const signer = this.web3Wallet.getSigner();
    const network = await signer.provider.getNetwork();
    const rpcUrl = network.chainId === 5 ? POLYGON_RPC_URL : MAINNET_RPC_URL;

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const from = await signer.getAddress();

    return this.getPOSClient(from, signer, provider);
  }

  private async getPOSClientChild() {
    const signer = this.web3Wallet.getSigner();
    const network = await signer.provider.getNetwork();
    const rpcUrl = network.chainId === 5 ? POLYGON_RPC_URL : MAINNET_RPC_URL;

    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
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
