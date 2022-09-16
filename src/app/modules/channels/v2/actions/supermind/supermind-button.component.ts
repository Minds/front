import { Component } from '@angular/core';
import { ChannelsV2Service } from '../../channels-v2.service';

@Component({
  selector: 'm-channelActions__supermind',
  templateUrl: './supermind-button.component.html',
  styleUrls: ['./supermind-button.component.ng.scss'],
})
export class ChannelActionsSuperminButtonComponent {
  constructor(public service: ChannelsV2Service) {}
}
