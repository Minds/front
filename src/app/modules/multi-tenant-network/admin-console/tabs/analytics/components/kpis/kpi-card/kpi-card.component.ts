import { Component, Input } from '@angular/core';
import { AnalyticsMetricEnum } from '../../../../../../../../../graphql/generated.engine';

/**
 * KPI card component for network admin analytics. Presentational component
 * for value and metric display.
 */
@Component({
  selector: 'm-networkAdminAnalytics__kpiCard',
  styleUrls: ['./kpi-card.component.ng.scss'],
  template: `
    <span class="m-kpiCard__value">{{
      value | metricValueParser: metric
    }}</span>
    <span class="m-kpiCard__metric">{{ metric | metricNameParser }}</span>
  `,
})
export class NetworkAdminAnalyticsKpiCardComponent {
  /** Value to be displayed. */
  @Input() protected value: string | number;

  /** Metric to be displayed. - human readable name will be parsed via the metricNameParser pipe. */
  @Input() protected metric: AnalyticsMetricEnum;
}
