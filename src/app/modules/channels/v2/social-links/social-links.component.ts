import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { KeyVal } from '../../../../interfaces/entities';
import {
  buildFromV1ChannelProfile,
  getSocialProfileMeta,
} from '../../social-profiles-meta';

/**
 * Social links (profiles) component. Standalone.
 * Displays icons that link to a channel's associated social media accounts
 */
@Component({
  selector: 'm-channel__socialLinks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'social-links.component.html',
})
export class ChannelSocialLinksComponent {
  /**
   * Social links metadata
   */
  socialLinks: Array<KeyVal> = [];

  /**
   * Filters and set social links
   * @param socialLinks
   * @private
   */
  @Input('socialLinks') set _socialLinks(socialLinks: Array<KeyVal>) {
    this.socialLinks = buildFromV1ChannelProfile(socialLinks)
      .filter(socialLink => socialLink.key && socialLink.value)
      .map(socialLink => {
        socialLink = { ...socialLink }; // Clone

        if (!socialLink.value.toLowerCase().startsWith('http')) {
          socialLink.value = `https://${socialLink.value}`;
        }

        return socialLink;
      });
  }

  /**
   * Builds the ngClass value for social links
   * @param socialLink
   */
  buildSocialLinkNgClass(socialLink: KeyVal): Array<string> {
    const meta = getSocialProfileMeta(socialLink.key);

    if (meta.customIcon) {
      return ['m-custom-icon', `m-custom-icon-${meta.icon}`];
    } else {
      return ['fa', 'fa-fw', `fa-${meta.icon}`];
    }
  }
}
