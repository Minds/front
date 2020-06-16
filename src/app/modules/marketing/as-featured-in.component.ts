import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-marketing__asFeaturedIn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in.component.html',
})
export class MarketingAsFeaturedInComponent {
  @Input() inThePress: boolean = false;

  readonly cdnAssetsUrl: string;

  constructor(private configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }
}
