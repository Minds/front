import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-plus--marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: ['../aux/aux.component.ng.scss', 'marketing.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nMarketingComponent {}
