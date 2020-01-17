import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-marketing__asFeaturedIn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in.component.html',
})
export class MarketingAsFeaturedInComponent {
  readonly cdnAssetsUrl: string;

  constructor(private configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
