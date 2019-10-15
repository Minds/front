import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-upgrades__buyTokens',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'buy-tokens.component.html',
})
export class BuyTokensComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
}
