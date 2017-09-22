import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { CommonModule } from '../../common/common.module';

import { VideoAdsDirective } from './ads-directive';
import { VideoAds, MindsVideo } from './video';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    RouterModule.forChild([])
  ],
  declarations: [
    VideoAdsDirective,
    VideoAds,
    MindsVideo
  ],
  exports: [
    VideoAdsDirective,
    VideoAds,
    MindsVideo
  ]
})
export class VideoModule {
}
