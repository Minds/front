import { Component, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { PolygonService } from '../../../../tokens/polygon/polygon.service';
import { BigNumber, ethers } from 'ethers';
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

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly polygonService: PolygonService,
    private readonly networkSwitchService: NetworkSwitchService
  ) {}

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
      result = await this.polygonService.withdraw(amount);
    } else {
      result = await this.polygonService.deposit(amount);
    }
    if (result) {
      this.navigate();
    }
  }

  private navigate() {
    this.networkBridgeService.currentStep$.next({ step: BridgeStep.PENDING });
  }
}
