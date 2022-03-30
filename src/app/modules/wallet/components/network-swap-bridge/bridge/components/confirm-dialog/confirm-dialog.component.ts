import { Component, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { PolygonService } from '../../../../tokens/polygon/polygon.service';
import { BigNumber } from 'ethers';

@Component({
  selector: 'm-networkConfirmation',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.ng.scss'],
})
export class NetworkBridgeConfirmationComponent implements OnInit {
  amount: string;
  to: string;
  from: string;

  isLoading;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly polygonService: PolygonService
  ) {
    this.isLoading = this.polygonService.isLoading$.value;
  }

  ngOnInit(): void {
    this.amount = this.networkBridgeService.currentStepData$.value.amount;
    this.from = this.networkBridgeService.currentStepData$.value.from;
    this.to = this.networkBridgeService.currentStepData$.value.to;
  }

  async transfer() {
    const tx = await this.polygonService
      .deposit(BigNumber.from(this.amount))
      .then(res => console.log(res));
    console.log(tx);
    // this.navigate();
  }

  private navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.PENDING);
  }
}
