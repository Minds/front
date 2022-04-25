import { Component, OnInit } from '@angular/core';
import { BridgeService, BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { ethers } from 'ethers';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../../common/services/network-switch-service';

@Component({
  selector: 'm-networkConfirmation',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.ng.scss'],
})
export class NetworkBridgeConfirmationComponent implements OnInit {
  amount: string;
  to: Network;
  from: Network;

  public loading = false;

  public readonly service: BridgeService;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly networkSwitchService: NetworkSwitchService
  ) {
    this.service = this.networkBridgeService.getBridgeService();
    this.service
      .getLoadingState()
      .subscribe(_loading => (this.loading = _loading));
  }

  ngOnInit(): void {
    if (
      this.networkBridgeService.currentStep$.value.step !==
      BridgeStep.CONFIRMATION
    ) {
      return;
    }
    this.amount = this.networkBridgeService.currentStep$.value.data.amount;
    this.from = this.networkBridgeService.currentStep$.value.data.from;
    this.to = this.networkBridgeService.currentStep$.value.data.to;
  }

  async transfer() {
    const amount = ethers.utils.parseEther(this.amount);
    try {
      if (this.to.id === this.networkSwitchService.networks.mainnet.id) {
        await this.service.withdraw(amount);
      } else {
        await this.service.deposit(amount);
      }
      this.navigate();
    } catch (e) {
      console.log('transfer error: ', e);
    }
  }

  private navigate() {
    const data = {
      amount: this.amount,
    };
    this.networkBridgeService.currentStep$.next({
      step: BridgeStep.PENDING,
      data,
    });
  }
}
