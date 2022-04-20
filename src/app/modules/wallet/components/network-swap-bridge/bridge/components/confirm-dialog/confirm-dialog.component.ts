import { Component, Injector, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { PolygonService } from '../../services/polygon/polygon.service';
import { BigNumber, ethers } from 'ethers';
import {
  Network,
  NetworkSwitchService,
} from '../../../../../../../common/services/network-switch-service';
import { SkaleService } from '../../../skale/skale.service';

@Component({
  selector: 'm-networkConfirmation',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.ng.scss'],
})
export class NetworkBridgeConfirmationComponent implements OnInit {
  amount: string;
  to: Network;
  from: Network;

  public service;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly networkSwitchService: NetworkSwitchService,
    public injector: Injector
  ) {
    if (
      this.networkBridgeService.selectedBridge$.value.id ===
      this.networkSwitchService.networks.polygon.id
    ) {
      this.service = <PolygonService>this.injector.get(PolygonService);
    } else {
      this.service = <SkaleService>this.injector.get(SkaleService);
    }
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
    let result: boolean;
    if (this.to.id === this.networkSwitchService.networks.mainnet.id) {
      result = await this.service.withdraw(amount);
    } else {
      result = await this.service.deposit(amount);
    }
    if (result) {
      this.navigate();
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
