import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '~/common/common.module';
import { MarketingModule } from '../marketing/marketing.module';

@Component({
  selector: 'm-i18n__marketing',
  templateUrl: 'marketing.component.html',
  styleUrls: [
    '../aux-pages/aux-pages.component.ng.scss',
    'marketing.component.ng.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MarketingModule],
})
export class I18nMarketingComponent {}
