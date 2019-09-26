import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChannelsModule } from '../channels/channels.module';
import { ProModule } from '../pro/pro.module';
import { ChannelContainerComponent } from './channel-container.component';
import { CommonModule } from '../../common/common.module';

@NgModule({
  imports: [NgCommonModule, CommonModule, ProModule, ChannelsModule],
  declarations: [ChannelContainerComponent],
  entryComponents: [ChannelContainerComponent],
})
export class ChannelContainerModule {}
