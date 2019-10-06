import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-marketing__asFeaturedIn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'as-featured-in.component.html',
})
export class MarketingAsFeaturedInComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
}
