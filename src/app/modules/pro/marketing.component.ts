import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'm-pro--marketing',
  templateUrl: 'marketing.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProMarketingComponent {
  minds = window.Minds;
}
