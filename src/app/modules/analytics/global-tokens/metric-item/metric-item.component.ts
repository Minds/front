import { Component, Input } from '@angular/core';
import { Metric } from '../global-tokens.service';

@Component({
  selector: 'm-analyticsGlobalTokens__metricItem',
  templateUrl: './metric-item.component.html',
  styleUrls: ['./metric-item.component.ng.scss'],
})
export class AnalyticsGlobalTokensMetricItemComponent {
  @Input() metric: Metric;
}
