import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { BoostAds } from './boost';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [BoostAds],
  exports: [BoostAds],
})
export class AdsModule {}
