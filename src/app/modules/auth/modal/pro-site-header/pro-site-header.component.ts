import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SiteService } from '../../../../common/services/site.service';

@Component({
  selector: 'm-authModal__proSiteHeader',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'pro-site-header.component.html',
  styleUrls: ['pro-site-header.component.ng.scss'],
})
export class AuthModalProSiteHeader {
  /**
   * @param siteService
   */
  constructor(public siteService: SiteService) {}

  /**
   * Build the banner's background CSS properties
   */
  bannerBackgroundImageCss(): any {
    return {
      backgroundImage: `url(${this.siteService.pro.background_image})`,
    };
  }

  /**
   * Build the logo's background CSS properties
   */
  bannerLogoCss(): any {
    return {
      backgroundImage: `url(${this.siteService.pro.logo_image})`,
    };
  }
}
