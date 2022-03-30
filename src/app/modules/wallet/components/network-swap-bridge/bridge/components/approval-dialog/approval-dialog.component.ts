import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { PolygonService } from '../../../../tokens/polygon/polygon.service';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { Network } from '../../../../../../../common/services/network-switch-service';

@Component({
  selector: 'm-networkApproval',
  templateUrl: 'approval-dialog.component.html',
  styleUrls: ['./approval-dialog.ng.scss'],
})
export class NetworkBridgeApprovalComponent implements OnInit {
  amount: string;
  from: Network;
  to: Network;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly polygonService: PolygonService
  ) {}

  ngOnInit(): void {
    if (
      this.networkBridgeService.currentStep$.value.step !== BridgeStep.APPROVAL
    ) {
      return;
    }
    this.amount = this.networkBridgeService.currentStep$.value.data.amount;
    this.from = this.networkBridgeService.currentStep$.value.data.from;
    this.to = this.networkBridgeService.currentStep$.value.data.to;
  }

  navigate() {
    this.networkBridgeService.currentStep$.next({
      step: BridgeStep.CONFIRMATION,
      data: {
        to: this.to,
        from: this.from,
        amount: this.amount,
      },
    });
  }

  async approve() {
    await this.polygonService.approve(ethers.utils.parseUnits(this.amount, 18));
    this.navigate();
  }

  async approveMax() {
    await this.polygonService.approve();
    this.navigate();
  }
}
