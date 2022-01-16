import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { InputBalance } from '../polygon.types';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolygonService } from '../polygon.service';
import { ethers } from 'ethers';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../common/services/network-switch-service';
import { Web3WalletService } from '../../../../../blockchain/web3-wallet.service';
import { filter } from 'rxjs/operators';

/**
 * Polygon component, giving users the ability to swap between networks.
 */
@Component({
  selector: 'm-wallet__polygon-bridge',
  templateUrl: 'bridge.component.html',
  styleUrls: ['./bridge.component.ng.scss'],
})
export class WalletPolygonBridgeComponent implements OnInit {
  // amount we are transacting.
  public amount = '0';

  @Output() changeTab = new EventEmitter<void>();

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    root: 0,
    child: 0,
  };

  public readonly POLYGON_NETWORK: Network;
  public readonly MAINNET_NETWORK: Network;

  // handle of networks
  fromNetwork: Network;
  receivingNetwork: Network;

  // form for input amount
  public form: FormGroup;

  private allowance = ethers.BigNumber.from(0);
  private currentChainId: number;

  constructor(
    public service: PolygonService,
    private networkSwitch: NetworkSwitchService,
    private web3Wallet: Web3WalletService
  ) {
    this.MAINNET_NETWORK = this.networkSwitch.networks.goerli;
    this.POLYGON_NETWORK = this.networkSwitch.networks.mumbai;
  }

  /**
   * Current active network from service.
   * @returns { Network } - currently active network from service.
   */
  get activeNetwork(): Network {
    return this.networkSwitch.getActiveNetwork();
  }

  get validNetwork() {
    return (
      this.currentChainId ===
      ethers.BigNumber.from(this.fromNetwork.id).toNumber()
    );
  }

  get currentNetworkBalance() {
    return this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName
      ? this.balance.root
      : this.balance.child;
  }

  get receivingNetworkBalance() {
    return this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName
      ? this.balance.child
      : this.balance.root;
  }

  get needsApproval() {
    return (
      this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName &&
      ethers.utils.parseEther(this.amount).gt(this.allowance)
    );
  }

  async ngOnInit(): Promise<void> {
    this.findNetworksInfo();

    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });

    this.networkSwitch.networkChanged$.subscribe(chainId => {
      console.log('chainId', chainId);
      this.currentChainId = chainId;
    });

    this.web3Wallet.provider$
      .pipe(filter(provider => provider !== null))
      .subscribe(() => this.initBalance());
  }

  /**
   * Max amount a user can input - returns the lowest of allowance and balance amount.
   * @returns { number } - maximum amount a user can input.
   */
  setMaxAmount() {
    this.amount =
      this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName
        ? this.balance.root.toString()
        : this.balance.child.toString();
  }

  /**
   // Finds current and receiving networks
   */
  findNetworksInfo() {
    if (this.activeNetwork.networkName === this.POLYGON_NETWORK.networkName) {
      this.fromNetwork = this.POLYGON_NETWORK;
      this.receivingNetwork = this.MAINNET_NETWORK;
    } else {
      this.fromNetwork = this.MAINNET_NETWORK;
      this.receivingNetwork = this.POLYGON_NETWORK;
    }
  }

  /**
   * Calls to approve amount via the service.
   * @returns { void }
   */
  public async approve() {
    await this.service.approve(ethers.utils.parseUnits(this.amount, 18));
    this.initBalance();
    setTimeout(() => this.initBalance(), 10000);
  }

  /**
   * Swaps input currency fields around by swapping networks
   * and triggering a reload.
   * @returns { void }
   */
  public async swapNetworks() {
    if (this.service.isOnMainnet()) {
      await this.service.switchNetworkPolygon();
    } else {
      await this.service.switchNetworkMainnet();
    }
    this.findNetworksInfo();
    this.initBalance();
  }

  /**
   * Calls to deposit via service.
   * @returns { void }
   */
  async deposit() {
    await this.service.deposit(ethers.utils.parseUnits(this.amount, 18));
    if (!this.service.hasError$.value) {
      this.changeTab.emit();
    }
  }

  /**
   * Calls to withdraw via the service.
   * @returns { void }
   */
  async withdraw() {
    await this.service.withdraw(ethers.utils.parseUnits(this.amount, 18));
    this.changeTab.emit();
  }

  transfer() {
    if (this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName) {
      return this.deposit();
    }
    return this.withdraw();
  }

  retry() {
    this.service.hasError$.next(false);
  }

  /**
   * Inits balances and calls to get allowance.
   * @returns { Promise<void> }
   */
  private async initBalance(): Promise<void> {
    try {
      const balances = await this.service.getBalances();
      console.log('initBalance', balances);

      this.balance = {
        root: parseFloat(ethers.utils.formatEther(balances.root)),
        child: parseFloat(ethers.utils.formatEther(balances.child)),
      };
      this.allowance = ethers.BigNumber.from(balances.approved);
    } catch (err) {
      console.warn('error fetching balances', err);
    }
  }
}
