import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { WireCreatorComponent } from '../../wire/creator/creator.component';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { BlockchainTdeBuyComponent } from '../tde-buy/tde-buy.component';
import { Session } from '../../../services/session';
import { Web3WalletService } from '../web3-wallet.service';
import { TokenDistributionEventService } from '../contracts/token-distribution-event.service';
import isMobile from '../../../helpers/is-mobile';
import * as BN from 'bn.js';

@Component({
  selector: 'm-blockchain__eth-modal',
  templateUrl: 'eth-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockchainEthModalComponent implements OnInit {
  @Input() rate = 1;
  @Output() close: EventEmitter<boolean> = new EventEmitter(true);

  error: string = '';
  usd: number = 40;
  hasMetamask: boolean = true; // True by default

  constructor(
    private web3Wallet: Web3WalletService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // grab latest ETH rate
    this.detectMetamask();
  }

  async detectMetamask() {
    this.hasMetamask = !(await this.web3Wallet.isLocal());
    this.detectChanges();
  }

  get ethRate(): number {
    const tokenUsdRate = 1.25;
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

  async buy() {
    this.error = '';
    this.detectChanges();

    if (!this.hasMetamask) {
      this.error = 'You need to install metamask';
      this.detectChanges();
      return;
    }

    if (this.usd > 40) {
      this.usd = 40;
      this.error = 'You can not purchase more than $40';
      this.detectChanges();
      return;
    }

    let win = window.open('/checkout?usd=' + this.usd);
    this.close.next(true);
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  isMobile() {
    return isMobile();
  }
}
