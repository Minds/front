import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProChannelService } from "../channel.service";

@Component({
  selector: 'm-pro--channel-donate',
  templateUrl: 'donate.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelDonateComponent {

  get currentChannel() {
    return this.channelService.currentChannel;
  }

  constructor(
    public channelService: ProChannelService
  ) {
  }

  onWireCompleted() {
    throw new Error('Not implemented');
  }
}
