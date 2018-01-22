import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '../../../../common/common.module';

import { MindsVideoProgressBar } from './progress-bar/progress-bar.component';
import { MindsVideoQualitySelector } from './quality-selector/quality-selector.component';
import { MindsVideoVolumeSlider } from './volume-slider/volume-slider.component';

import { VideoAdsDirective } from './ads.directive';
import { VideoAds, MindsVideoComponent } from './video.component';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([])
  ],
  declarations: [
    VideoAdsDirective,
    VideoAds,
    MindsVideoComponent,
    MindsVideoProgressBar,
    MindsVideoQualitySelector,
    MindsVideoVolumeSlider
  ],
  exports: [
    VideoAdsDirective,
    VideoAds,
    MindsVideoComponent
  ],
})
export class VideoModule {
}
