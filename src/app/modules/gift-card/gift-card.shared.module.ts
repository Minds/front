import { NgModule } from '@angular/core';
import {
  CommonModule as NgCommonModule,
  NgOptimizedImage,
} from '@angular/common';
import { CommonModule } from '../../common/common.module';
import { GiftCardComponent } from './common/gift-card.component';

@NgModule({
  imports: [NgCommonModule, CommonModule, NgOptimizedImage],
  declarations: [GiftCardComponent],
  exports: [GiftCardComponent],
})
export class GiftCardSharedModule {}
