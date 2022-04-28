import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../../common/services/network-switch-service';
import { BridgeStep, InputBalance } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { ethers } from 'ethers';

@Component({
  selector: 'm-networkSwapBox',
  templateUrl: 'swap-box.component.html',
  styleUrls: [
    '../bridge-panel/network-swap-bridge-common.ng.scss',
    './swap-box.ng.scss',
  ],
})
export class NetworkBridgeSwapBoxComponent implements OnInit {
  // amount we are transacting.
  public amount = '0';

  // balance, held with active input currency for display purposes.
  public balance: InputBalance = {
    root: 0,
    child: 0,
  };
  public readonly POLYGON_NETWORK: Network;
  public readonly MAINNET_NETWORK: Network;
  public readonly SKALE_NETWORK: Network;
  // handle injected service
  public service;
  // handle of networks
  fromNetwork: Network;
  receivingNetwork: Network;
  // form for input amount
  public form: FormGroup;
  private allowance = ethers.BigNumber.from(0);

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly networkSwitchService: NetworkSwitchService
  ) {
    this.service = this.networkBridgeService.getBridgeService();
    this.MAINNET_NETWORK = this.networkSwitchService.networks.mainnet;
    this.POLYGON_NETWORK = this.networkSwitchService.networks.polygon;
    this.SKALE_NETWORK = this.networkSwitchService.networks.skale;
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

  async ngOnInit(): Promise<void> {
    this.fromNetwork = this.MAINNET_NETWORK;
    this.receivingNetwork = this.networkBridgeService.selectedBridge$.value;

    this.form = new FormGroup({
      amount: new FormControl(''),
    });

    await this.initBalance();

    this.form.controls['amount'].setValidators([
      Validators.required,
      Validators.min(0.001),
      Validators.max(this.currentNetworkBalance),
    ]);
    this.form.controls['amount'].updateValueAndValidity();
  }

  navigateError() {
    this.networkBridgeService.currentStep$.next({
      step: BridgeStep.ERROR,
      data: {
        title: 'No wallet connected',
        subtitle: 'Connect your MetaMask wallet before continuing',
      },
    });
  }

  navigate() {
    const data = {
      amount: this.amount,
      from: this.fromNetwork,
      to: this.receivingNetwork,
    };

    if (this.needsApproval()) {
      this.networkBridgeService.currentStep$.next({
        step: BridgeStep.APPROVAL,
        data,
      });
      return;
    }

    this.networkBridgeService.currentStep$.next({
      step: BridgeStep.CONFIRMATION,
      data,
    });
  }

  /**
   * Swaps input currency fields around by swapping networks
   * and triggering a reload.
   * @returns { void }
   */
  public async swapNetworks() {
    this.amount = '0';
    [this.fromNetwork, this.receivingNetwork] = [
      this.receivingNetwork,
      this.fromNetwork,
    ];
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

  public needsApproval() {
    return (
      this.fromNetwork.networkName === this.MAINNET_NETWORK.networkName &&
      ethers.utils.parseEther(this.amount).gt(this.allowance)
    );
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
      this.allowance = ethers.BigNumber.from(balances.approved);
    } catch (err) {
      console.warn('error fetching balances', err);
    }
  }
}
