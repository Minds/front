import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-pro--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProMarketingComponent {
  minds = window.Minds;

  constructor(protected router: Router) {}

  goToSettings() {
    this.router.navigate(['/pro/settings']);
  }
}
