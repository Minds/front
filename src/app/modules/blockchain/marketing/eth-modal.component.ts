import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsTitle } from '../../../services/ux/title';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BlockchainTdeBuyComponent } from '../tde-buy/tde-buy.component';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenDistributionEventService } from '../contracts/token-distribution-event.service';
import * as BN from 'bn.js';

@Component({
  selector: 'm-blockchain__eth-modal',
  templateUrl: 'eth-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainEthModalComponent implements OnInit {

  @Input() rate = 1;
  @Output() close: EventEmitter<boolean> = new EventEmitter(true);

  error: string = '';
  usd: number = 40;

  ngOnInit() {
    // grab latest ETH rate
  }

  get ethRate(): number {
    const tokenUsdRate = 0.15;
    const tokenUsd = 1 / tokenUsdRate;
    const usd = this.rate / tokenUsd;
    return usd;
  }

  get eth(): number {
    return this.usd / this.ethRate; 
  }

  setEth(eth) {
    this.usd = eth * this.ethRate;
  }

  buy() {
    this.error = '';
    if (this.usd > 40) {
      this.usd = 40;
      this.error = 'You can not purchase more than $40';
    }
    let win = window.open('/checkout?usd=' + this.usd);
    this.close.next(true);
  }

}
