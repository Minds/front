import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelEditService } from './edit.service';

/**
 * Social Links accordion pane content
 * Allows users to add/remove links that connect their channel to their other social media accounts
 */
@Component({
  selector: 'm-channelEdit__socialLinks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'social-links.component.html',
  styleUrls: ['social-links.component.ng.scss'],
})
export class ChannelEditSocialLinksComponent {
  /**
   * Local state for URL input
   */
  url: string = '';

  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelEditService) {}

  /**
   * Adds social link and clears input
   */
  addSocialLink() {
    if (!this.url) {
      return;
    }

    this.service.addSocialLink(this.url);
    this.url = '';
  }
}
