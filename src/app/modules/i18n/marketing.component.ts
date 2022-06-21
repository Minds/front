import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'm-i18n__marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: [
    '../aux-pages/aux-pages.component.ng.scss',
    'marketing.component.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class I18nMarketingComponent {}
