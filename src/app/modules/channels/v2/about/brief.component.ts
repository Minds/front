import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

/**
 * Container for channel description, location, subs, view count. Displayed above or on side of channel feed, depending on screen width. Not displayed for channel owner.
 */
@Component({
  selector: 'm-channelAbout__brief',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief.component.html',
})
export class ChannelAboutBriefComponent {
  constructor(public service: ChannelsV2Service) {}
}
