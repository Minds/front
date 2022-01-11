import { Component, OnInit } from '@angular/core';
import { InputBalance } from '../polygon.types';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolygonService } from '../polygon.service';
import { ethers } from 'ethers';
import { NetworksInfo } from '../constants';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../common/services/network-switch-service';
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

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    root: 0,
    child: 0,
  };

  // handle of networks
  currentNetwork;
  receivingNetwork;

  // handle current tab
  bridge = true;

  // token allowance
  public allowance = 0;

  // form for input amount
  public form: FormGroup;

  constructor(
    private service: PolygonService,
    private networkSwitch: NetworkSwitchService
  ) {}

  /**
   * Current active network from service.
   * @returns { Network } - currently active network from service.
   */
  get activeNetwork(): Network {
    return this.networkSwitch.getActiveNetwork();
  }

  async ngOnInit(): Promise<void> {
    this.findNetworksInfo();

    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });

    await this.service.initialize();
    await this.initBalance();
  }

  /**
   * Max amount a user can input - returns the lowest of allowance and balance amount.
   * @returns { number } - maximum amount a user can input.
   */
  setMaxAmount() {
    this.amount = this.balance.root.toString();
  }

  /**
    // Finds current and receiving networks
    */
  findNetworksInfo() {
    NetworksInfo.map(current => {
      if (current.networkName === this.activeNetwork.networkName) {
        this.currentNetwork = current;
      } else {
        this.receivingNetwork = current;
      }
    });
  }

  /**
   * Calls to approve amount via the service.
   * @returns { void }
   */
  public async approve() {
    await this.service.approve(ethers.utils.parseUnits(this.amount, 18));
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
    await this.initBalance();
  }

  /**
   * Calls to deposit via service.
   * @returns { void }
   */
  async deposit() {
    await this.service.deposit(ethers.utils.parseUnits(this.amount, 18));
  }

  /**
   * Calls to withdraw via the service.
   * @returns { void }
   */
  async withdraw() {
    await this.service.withdraw(ethers.utils.parseUnits(this.amount, 18));
  }

  /**
   * Inits balances and calls to get allowance.
   * @returns { Promise<void> }
   */
  private async initBalance(): Promise<void> {
    try {
      const balances = await this.service.getBalances();
      this.balance = {
        root: parseFloat(ethers.utils.formatEther(balances.root)),
        child: parseFloat(ethers.utils.formatEther(balances.child)),
      };
      this.matchBalances();
    } catch (err) {
      console.warn('error fetching balances', err);
    }
  }

  /**
   * Matches balances with current and receiving balance.
   * @returns { void }
   */
  matchBalances() {
    if (this.currentNetwork.networkName === 'Goerli') {
      this.currentNetwork.balance = this.balance.root;
      this.receivingNetwork.balance = this.balance.child;
    } else {
      this.currentNetwork.balance = this.balance.child;
      this.receivingNetwork.balance = this.balance.root;
    }
  }
  // amount we are transacting
}
