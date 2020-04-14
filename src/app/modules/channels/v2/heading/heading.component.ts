import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MindsUser } from '../../../../interfaces/entities';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';

@Component({
  selector: 'm-channel__heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'heading.component.html',
})
export class ChannelHeadingComponent {
  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: ChannelsV2Service, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * Build the banner's background CSS properties
   * @param channel
   */
  bannerBackgroundImageCss(channel: MindsUser | null): any {
    const bannerUrl = entityToBannerUrl(channel);

    if (!bannerUrl) {
      return {};
    }

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl})`,
    };
  }
}
