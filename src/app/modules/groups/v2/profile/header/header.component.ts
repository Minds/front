import { Component } from '@angular/core';
import { GroupV2Service } from '../../services/group-v2.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import entityToBannerUrl from '../../../../../helpers/entity-to-banner-url';

@Component({
  selector: 'm-group__header',
  templateUrl: 'header.component.html',
})
export class GroupHeaderComponent {
  /**
   * CDN URL
   */
  readonly cdnUrl: string;

  constructor(public service: GroupV2Service, configs: ConfigsService) {
    this.cdnUrl = configs.get('cdn_url');
  }

  /**
   * Build the banner's background CSS properties
   * @param group
   */
  bannerBackgroundImageCss(group: any): any {
    const bannerUrl = entityToBannerUrl(group);

    if (!bannerUrl) {
      return {};
    }

    return {
      backgroundImage: `url(${this.cdnUrl}${bannerUrl})`,
    };
  }
}
