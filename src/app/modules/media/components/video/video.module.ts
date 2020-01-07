import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '../../../../common/common.module';
import { MindsVideoPlayerComponent } from '../video-player/player.component';
import { PlyrModule } from 'ngx-plyr';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([]),
    PlyrModule,
  ],
  declarations: [MindsVideoPlayerComponent],
  exports: [MindsVideoPlayerComponent],
})
export class VideoModule {}
