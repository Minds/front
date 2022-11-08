import { Component } from '@angular/core';
import { ChannelsV2Service } from '../../channels-v2.service';

@Component({
  selector: 'm-channelActions__supermind',
  templateUrl: './supermind-button.component.html',
})
export class ChannelActionsSuperminButtonComponent {
  constructor(public service: ChannelsV2Service) {}
}
