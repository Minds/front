import { Component, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

@Component({
  selector: 'm-networkConfirmation',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.ng.scss'],
})
export class NetworkBridgeConfirmationComponent implements OnInit {
  constructor(private readonly networkBridgeService: NetworkBridgeService) {}

  ngOnInit(): void {}

  navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.PENDING);
  }
}
