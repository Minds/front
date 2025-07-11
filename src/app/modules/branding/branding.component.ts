import { Component } from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';
import { MarketingModule } from '../marketing/marketing.module';

/**
 * Auxilliary page with download links for various
 * digital assets (Minds logos and mobile product images)
 */
@Component({
  selector: 'm-branding',
  templateUrl: 'branding.component.html',
  styleUrls: ['./branding.component.ng.scss'],
  imports: [MarketingModule],
})
export class BrandingComponent {
  readonly cdnAssetsUrl: string;
  constructor(public configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
