import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
})
export class MarketingFooterComponent {
  readonly year: number = new Date().getFullYear();

  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;
}
