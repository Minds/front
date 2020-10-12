import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '../../../../common/common.module';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MindsVideoPlayerComponent } from '../video-player/player.component';
import { PlyrModule } from 'ngx-plyr';
import { ScrollAwareVideoPlayerComponent } from '../video-player/scrollaware-player.component';

@NgModule({
  imports: [NgCommonModule, RouterModule.forChild([]), PlyrModule],
  declarations: [MindsVideoPlayerComponent, ScrollAwareVideoPlayerComponent],
  exports: [MindsVideoPlayerComponent, ScrollAwareVideoPlayerComponent],
  providers: [OverlayModalService],
})
export class VideoModule {}
