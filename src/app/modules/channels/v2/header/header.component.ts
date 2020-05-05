import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MindsUser } from '../../../../interfaces/entities';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';
import { ChannelBannerService } from '../../../../common/services/channel-banner.service';

@Component({
  selector: 'm-channel__header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'header.component.html',
})
export class ChannelHeaderComponent {
  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(
    private service: ChannelsV2Service,
    private bannerService: ChannelBannerService,
    private configs: ConfigsService
  ) {
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

    const fallbackBanner = this.bannerService.getSeededBannerUrl(channel);

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl}), url(${fallbackBanner})`,
    };
  }
}
