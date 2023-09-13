import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';

export type ChannelAboutBriefLocation = 'main' | 'sidebar';
/**
 * Container for channel description, location, subs, view count, and maybe social links (depending on location).
 *
 * Displayed in the main column or the sidebar of the channel feed, depending on screen width.
 */
@Component({
  selector: 'm-channelAbout__brief',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'brief.component.html',
})
export class ChannelAboutBriefComponent {
  @Input() location: ChannelAboutBriefLocation = 'main';

  constructor(public service: ChannelsV2Service) {}
}
