import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChannelsModule } from '../channels/channels.module';
import { ProModule } from '../pro/pro.module';
import { ChannelContainerComponent } from './channel-container.component';
import { CommonModule } from '../../common/common.module';
import { ChannelsV2Module } from '../channels/v2/channels-v2.module';
import { CanDeactivateGuardService } from '../../services/can-deactivate-guard';

@NgModule({
  imports: [
    NgCommonModule,
    CommonModule,
    ProModule,
    ChannelsModule,
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
  declarations: [ChannelContainerComponent],
})
export class ChannelContainerModule {}
