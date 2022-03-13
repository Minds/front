import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

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
  public amount = 0;

  // form for input amount
  public form: FormGroup;

  constructor(private readonly networkBridgeService: NetworkBridgeService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      amount: new FormControl('', {
        validators: [Validators.required, Validators.min(0.001)],
      }),
    });
  }

  navigateError() {
    this.networkBridgeService.currentStep$.next(BridgeStep.ERROR);
    this.networkBridgeService.currentStepData$.next({
      title: 'No wallet connected',
      subtitle: 'Connect your MetaMask wallet before continuing',
    });
  }

  navigate() {
    this.networkBridgeService.currentStep$.next(BridgeStep.APPROVAL);
  }
}
