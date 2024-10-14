import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelContainerComponent } from './channel-container.component';
import { CommonModule } from '../../common/common.module';
import { ChannelsV2Module } from '../channels/v2/channels-v2.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';
import { ActivityService } from '../../common/services/activity.service';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ChannelsV2Module,
    RouterModule.forChild([
      // Note: The wildcard lazy loads this
      {
        path: '',
        component: ChannelContainerComponent,
        canDeactivate: [CanDeactivateGuardService],
      },
    ]),
  ],
  providers: [ActivityService],
  declarations: [ChannelContainerComponent],
})
export class ChannelContainerModule {}
