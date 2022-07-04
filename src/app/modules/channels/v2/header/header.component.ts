import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChannelsV2Service } from '../channels-v2.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { MindsUser } from '../../../../interfaces/entities';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';
import { Session } from '../../../../services/session';

/**
 * Topmost section of channel page, containing
 * banner (with avatar image and actions toolbar)
 * and username/handle
 */
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
    public service: ChannelsV2Service,
    configs: ConfigsService,
    private session: Session
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

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl})`,
    };
  }

  shouldShowSubscribesToYou(channel: MindsUser) {
    return (
      channel.guid !== this.session.getLoggedInUser().guid && channel.subscriber
    );
  }
}
