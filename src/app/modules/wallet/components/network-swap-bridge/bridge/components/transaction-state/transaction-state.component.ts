import { Component, OnInit } from '@angular/core';
import {
  BridgeStep,
  DepositState,
  Descriptions,
  Titles,
} from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';

@Component({
  selector: 'm-networkPending',
  templateUrl: 'transaction-state.component.html',
  styleUrls: ['./transaction-state.ng.scss'],
})
export class NetworkBridgePendingComponent implements OnInit {
  amount: string;

  constructor(private readonly networkBridgeService: NetworkBridgeService) {}

  proposalState = 0;

  public transactionState = DepositState;

  public states;
  keys(): Array<string> {
    let keys = Object.keys(DepositState);
    return keys.slice(keys.length / 2);
  }

  ngOnInit(): void {
    if (
      this.networkBridgeService.currentStep$.value.step !== BridgeStep.PENDING
    ) {
      return;
    }
    this.amount = this.networkBridgeService.currentStep$.value.data.amount;
    this.states = this.keys();
    this.getTitles();
  }

  changeState() {
    this.proposalState++;
    if (this.proposalState === 1) {
      this.activateStepTwo();
    }
    if (this.proposalState === 2) {
      this.activateStepThree();
    }
  }

  activateStepTwo() {
    const step = document.getElementById('step2');
    step.classList.remove('m-networkPending_step-current');
    step.classList.add('m-networkPending_step-pending');
  }

  activateStepThree() {
    const step = document.getElementById('step2');
    step.classList.remove('m-networkPending_step-pending');
    step.classList.add('m-networkPending_step-complete');
    const stepThree = document.getElementById('step3');
    stepThree.classList.add('m-networkPending_step-current');
  }

  getTitles() {
    let keys = Object.keys(Titles);
    return keys.slice(keys.length / 2)[this.proposalState];
  }

  getDescription() {
    let keys = Object.keys(Descriptions);
    return keys.slice(keys.length / 2)[this.proposalState];
  }
}
