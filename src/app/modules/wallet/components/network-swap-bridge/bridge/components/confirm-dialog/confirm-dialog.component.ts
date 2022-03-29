import { Component, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

@Component({
  selector: 'm-networkConfirmation',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.ng.scss'],
})
export class NetworkBridgeConfirmationComponent implements OnInit {
  amount: string;
  to: string;
  from: string;

  constructor(private readonly networkBridgeService: NetworkBridgeService) {}

  ngOnInit(): void {
    this.amount = this.networkBridgeService.currentStepData$.value.amount;
    this.from = this.networkBridgeService.currentStepData$.value.from;
    this.to = this.networkBridgeService.currentStepData$.value.to;
  }

  navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.PENDING);
  }
}
