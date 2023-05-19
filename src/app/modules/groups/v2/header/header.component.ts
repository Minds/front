import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GroupService } from '../group.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import entityToBannerUrl from '../../../../helpers/entity-to-banner-url';
import { MindsGroup } from '../group.model';

/**
 * Topmost section of group page, containing
 * banner (with avatar image and actions toolbar)
 * and name
 */
@Component({
  selector: 'm-group__header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.ng.scss'],
})
export class GroupHeaderComponent {
  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  /**
   * Constructor. Retrieves CDN URL.
   * @param service
   * @param configs
   */
  constructor(public service: GroupService, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * Build the banner's background CSS properties
   * @param group
   */
  bannerBackgroundImageCss(group: MindsGroup | null): any {
    const bannerUrl = entityToBannerUrl(group);

    if (!bannerUrl) {
      return {};
    }

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl})`,
    };
  }
}
