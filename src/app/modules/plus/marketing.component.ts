import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlusMarketingComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
}
