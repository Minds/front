import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { PolygonService } from '../../../../tokens/polygon/polygon.service';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

@Component({
  selector: 'm-networkApproval',
  templateUrl: 'approval-dialog.component.html',
  styleUrls: ['./approval-dialog.ng.scss'],
})
export class NetworkBridgeApprovalComponent implements OnInit {
  amount: string;
  from: string;
  to: string;

  constructor(
    private readonly networkBridgeService: NetworkBridgeService,
    private readonly polygonService: PolygonService
  ) {}

  ngOnInit(): void {
    this.amount = this.networkBridgeService.currentStepData$.value.amount;
    this.from = this.networkBridgeService.currentStepData$.value.from;
    this.to = this.networkBridgeService.currentStepData$.value.to;
  }

  navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.CONFIRMATION);
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
