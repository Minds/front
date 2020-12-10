import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { LiquiditySpotComponent } from './liquidity-spot.component';

@NgModule({
  imports: [CommonModule, NgCommonModule],
  declarations: [LiquiditySpotComponent],
  exports: [LiquiditySpotComponent],
})
export class LiquiditySpotModule {}
