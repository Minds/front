import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MindsUser } from '../../../../../interfaces/entities';
import { WireV2Service } from '../../wire-v2.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import entityToBannerUrl from '../../../../../helpers/entity-to-banner-url';

/**
 * Displays a banner that features the user who is a recipient of payment.
 *
 * See it at the top of the tip modal when one user is sending payment to another.
 *
 */
@Component({
  selector: 'm-wireCreator__ownerBlock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'owner-block.component.html',
  styleUrls: ['owner-block.component.ng.scss'],
})
export class WireCreatorOwnerBlock {
  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: WireV2Service, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * Build the banner's background CSS properties
   * @param owner
   */
  bannerBackgroundImageCss(owner: MindsUser | null): any {
    const bannerUrl = entityToBannerUrl(owner);

    if (!bannerUrl) {
      return {};
    }

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl})`,
    };
  }
}
