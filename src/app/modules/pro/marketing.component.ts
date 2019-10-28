import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-pro--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProMarketingComponent {
  readonly cdnAssetsUrl: string = window.Minds.cdn_assets_url;

  constructor(protected router: Router) {}

  goToSettings() {
    this.router.navigate(['/pro/settings']);
  }
}
