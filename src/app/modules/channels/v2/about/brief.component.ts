import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

@Component({
  selector: 'm-channelAbout__brief',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief.component.html',
})
export class ChannelAboutBriefComponent {
  constructor(public service: ChannelsV2Service) {}
}
