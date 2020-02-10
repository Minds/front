import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigsService } from '../../common/services/configs.service';

@Component({
  selector: 'm-upgrades__buyTokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens.component.html',
})
export class BuyTokensComponent {
  readonly cdnAssetsUrl: string;

  constructor(protected router: Router, configs: ConfigsService) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  onPurchaseComplete(purchase: any) {}
}
