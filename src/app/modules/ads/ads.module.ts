import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import { CommonModule } from '../../common/common.module';

import { BoostAds } from './ads';
import { NewsfeedModule } from '../newsfeed/newsfeed.module';

@NgModule({
  imports: [NgCommonModule, CommonModule],
  declarations: [BoostAds],
  exports: [BoostAds],
})
export class AdsModule {}
