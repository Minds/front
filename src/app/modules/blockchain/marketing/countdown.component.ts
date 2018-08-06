import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { MindsTitle } from '../../../services/ux/title';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Session } from '../../../services/session';
import * as BN from 'bn.js';

@Component({
  selector: 'm-blockchain--marketing--countdown',
  templateUrl: 'countdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockchainMarketingCountdownComponent implements OnInit {

  end = new Date("Aug 13, 2018 12:00:00 UTC").getTime();

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  interval;

  constructor(private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.countDown();
  }

  countDown() {
    this.interval = setInterval(() => {
      let now = new Date().getTime();
      let distance = this.end - now;

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.cd.markForCheck();
      this.cd.detectChanges();
    });
  }  

  ngOnDestroy() {
    if (this.interval)
      clearInterval(this.interval);
  }

}
