import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
import { KeyVal } from '../../../../interfaces/entities';
import {
  buildFromV1ChannelProfile,
  getSocialProfileMeta,
} from '../../social-profiles-meta';
import isMobile from '../../../../helpers/is-mobile';
import { ConfigsService } from '../../../../common/services/configs.service';

/**
 * Social links (profiles) component. Standalone.
 * Displays icons that link to a channel's associated social media accounts
 */
@Component({
  selector: 'm-channel__socialLinks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'social-links.component.html',
  styleUrls: ['social-links.component.ng.scss'],
})
export class ChannelSocialLinksComponent implements OnInit {
  /**
   * We show max 5 items in sidebar and mobile web
   */
  @Input() showAll: boolean = true;

  /**
   * Social links metadata
   */
  socialLinks: Array<KeyVal> = [];

  /**
   * Is this being presented in the page layout sidebar?
   */
  @HostBinding('class.m-channel__socialLinks--sidebar')
  @Input()
  isSidebar: boolean = false;

  protected readonly cdnAssetsUrl;

  /**
   * Filters and set social links
   * @param socialLinks
   * @private
   */
  @Input('socialLinks') set _socialLinks(socialLinks: Array<KeyVal>) {
    this.socialLinks = buildFromV1ChannelProfile(socialLinks)
      .filter((socialLink) => socialLink.key && socialLink.value)
      .map((socialLink) => {
        socialLink = { ...socialLink }; // Clone

        if (!socialLink.value.toLowerCase().startsWith('http')) {
          socialLink.value = `https://${socialLink.value}`;
        }

        let linkWithMeta = {
          ...socialLink,
          ...this.getSocialProfileMeta(socialLink.key),
        };

        linkWithMeta['shortLink'] = this.shortenLink(linkWithMeta.value);

        return linkWithMeta;
      });
  }

  constructor(configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    if (isMobile()) {
      this.showAll = false;
    }
  }

  /**
   *
   * @param url
   * @returns a more presentable link
   */
  shortenLink(url: string): string {
    // let shortLink = url.replace(/http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/, '');

    // remove http(s):// and www.
    let shortLink = url.replace(/https?:\/\/(www\.)?/gi, '');

    // remove query parameters
    shortLink = shortLink.split('?')[0];

    return shortLink;
  }

  getSocialProfileMeta(key) {
    return getSocialProfileMeta(key);
  }

  /**
   * Builds the ngClass value for social links
   * @param socialLink
   */
  buildSocialLinkNgClass(socialLink: KeyVal): Array<string> {
    const meta = getSocialProfileMeta(socialLink.key);

    if (meta.customIcon) return;

    return ['fa', `fa-${meta.icon}`];
  }

  getCustomIconCss(icon): any {
    const maskImage = `url(assets/icons/${icon}.svg)`;

    return {
      '-webkit-mask-image': `${maskImage}`,
      'mask-image': `${maskImage}`,
    };
  }
}
