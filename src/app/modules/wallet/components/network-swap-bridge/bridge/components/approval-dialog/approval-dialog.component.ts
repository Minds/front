import { Component, OnInit } from '@angular/core';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

@Component({
  selector: 'm-networkApproval',
  templateUrl: 'approval-dialog.component.html',
  styleUrls: ['./approval-dialog.ng.scss'],
})
export class NetworkBridgeApprovalComponent implements OnInit {
  constructor(private readonly networkBridgeService: NetworkBridgeService) {}

  ngOnInit(): void {}

  navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.CONFIRMATION);
  }
}
