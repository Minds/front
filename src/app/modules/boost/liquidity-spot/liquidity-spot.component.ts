import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MindsUser } from '../../../interfaces/entities';
import { UniswapModalService } from '../../blockchain/token-purchase/uniswap/uniswap-modal.service';
import { LiquiditySpotService } from './liquidity-spot.service';

@Component({
  selector: 'm-liquiditySpot',
  templateUrl: './liquidity-spot.component.html',
  styleUrls: ['./liquidity-spot.component.ng.scss'],
  providers: [LiquiditySpotService],
})
export class LiquiditySpotComponent implements OnInit {
  entity$: Subject<MindsUser> = this.service.entity$;

  constructor(
    private service: LiquiditySpotService,
    private uniswapModalService: UniswapModalService
  ) {}

  ngOnInit() {
    this.service.load().then(() => {});
  }

  async onClick(e: MouseEvent): Promise<void> {
    await this.uniswapModalService.open('add');
  }
}
