import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MindsVideoPlayerComponent } from '../video-player/player.component';
import { PlyrModule } from '@mindsorg/ngx-plyr';
import { ScrollAwareVideoPlayerComponent } from '../video-player/scrollaware-player.component';
import { AutoProgressOverlayComponent } from './auto-progress-overlay/auto-progress-overlay.component';

@NgModule({
  imports: [NgCommonModule, RouterModule.forChild([]), PlyrModule],
  declarations: [
    MindsVideoPlayerComponent,
    ScrollAwareVideoPlayerComponent,
    AutoProgressOverlayComponent,
  ],
  exports: [
    MindsVideoPlayerComponent,
    ScrollAwareVideoPlayerComponent,
    AutoProgressOverlayComponent,
  ],
})
export class VideoModule {}
