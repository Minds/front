import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { LiquiditySpotService } from './liquidity-spot.service';

@Component({
  selector: 'm-liquiditySpot',
  templateUrl: './liquidity-spot.component.html',
  styleUrls: ['./liquidity-spot.component.ng.scss'],
  providers: [LiquiditySpotService],
})
export class LiquiditySpotComponent implements OnInit {
  entity$: Subject<MindsUser> = this.service.entity$;

  constructor(private service: LiquiditySpotService) {}

  ngOnInit() {
    this.service.load().then(() => {});
  }
}
