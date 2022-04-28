import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { BridgeService, BridgeStep } from '../../constants/constants.types';
import { NetworkBridgeService } from '../../services/network-bridge.service';
import { PolygonService } from '../../services/polygon/polygon.service';

@Component({
  selector: 'm-withdrawTransactionState',
  templateUrl: 'withdraw-transaction-state.component.html',
  styleUrls: ['./withdraw-transaction-state.ng.scss'],
})
export class WithdrawTransactionStateComponent implements OnInit {
  amount: string;
  txBurn: string;
  txLink: string;
  proposalState = 0;
  public states;

  private service: BridgeService;

  constructor(private readonly networkBridgeService: NetworkBridgeService) {
    this.service = this.networkBridgeService.getBridgeService();
  }

  ngOnInit(): void {
    if (
      this.networkBridgeService.currentStep$.value.step !==
      BridgeStep.ACTION_REQUIRED
    ) {
      return;
    }
    const {
      txBurn,
      amount,
    } = this.networkBridgeService.currentStep$.value.data;
    this.proposalState = 1; // Action Required State
    this.txBurn = txBurn;
    this.amount = this.formatAmount(amount);
    this.getTitles();
  }

  changeState() {
    this.proposalState++;
    if (this.proposalState >= 1) {
      this.activateStepTwo();
    }
    if (this.proposalState >= 3) {
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
    const stepThree = document.getElementById('step3');
    step.classList.remove('m-networkPending_step-pending');
    step.classList.add('m-networkPending_step-complete');
    stepThree.classList.add('m-networkPending_step-current');
  }

  getTitles(): string {
    switch (this.proposalState) {
      case 0:
        return 'Waiting for checkpoint';
      case 1:
        return 'Checkpoint arrived';
      case 2:
        return 'Transaction in Progress';
    }
    return 'Transfer complete';
  }

  getDescription() {
    switch (this.proposalState) {
      case 0:
      case 1:
        return 'Please wait until the Polygon PoS checkpoint arrives that includes your withdraw transaction. Checkpointing takes ~45 mins to 3 hours. In case of any issue, please reach out';
      case 2:
        return 'Ethereum transactions can take longer time to complete based upon network congestion. Please wait or increase the gas price of the transaction. In case of any issue, please reach out to support';
    }
    return 'Your transfer is now complete. Add summary.';
  }

  formatAmount(amount: string) {
    return parseFloat(ethers.utils.formatEther(amount)).toFixed(2);
  }

  async handleTransaction() {
    try {
      this.proposalState = 2;
      if (this.service instanceof PolygonService) {
        // The exit function is only for Polygon Bridge
        const receipt = await this.service.exit(this.txBurn);
        this.txLink = this.getExplorerLink(receipt.transactionHash);
      } else {
        // Implement SKALE exit equivalent function
      }
      this.changeState();
    } catch (e) {
      this.proposalState = 1;
    }
  }

  private getExplorerLink(hash: string) {
    return `https://goerli.etherscan.io/tx/${hash}`;
  }
}
