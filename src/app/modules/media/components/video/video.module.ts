import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MindsVideoPlayerComponent } from '../video-player/player.component';
import { PlyrModule } from 'ngx-plyr-mg';
import { ScrollAwareVideoPlayerComponent } from '../video-player/scrollaware-player.component';
import { VjsPlayerComponent } from '../video-player/player-v2/vjs-player/vjs-player.component';
import { MindsVideoPlayerV2Component } from '../video-player/player-v2/player-v2.component';

@NgModule({
  imports: [NgCommonModule, RouterModule.forChild([]), PlyrModule],
  declarations: [
    MindsVideoPlayerComponent,
    MindsVideoPlayerV2Component,
    ScrollAwareVideoPlayerComponent,
    VjsPlayerComponent,
  ],
  exports: [
    MindsVideoPlayerComponent,
    MindsVideoPlayerV2Component,
    ScrollAwareVideoPlayerComponent,
    VjsPlayerComponent,
  ],
})
export class VideoModule {}
