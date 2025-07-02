import { Component } from '@angular/core';
import { ChannelsV2Service } from '../../channels-v2.service';

@Component({
  selector: 'm-channelActions__supermind',
  templateUrl: './supermind-button.component.html',
  standalone: false,
})
export class ChannelActionsSupermindButtonComponent {
  constructor(public service: ChannelsV2Service) {}
}
