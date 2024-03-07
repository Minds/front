import { Component, Input } from '@angular/core';
import {
  AnalyticsKpiType,
  AnalyticsMetricEnum,
} from '../../../../../../../../graphql/generated.engine';

/**
 * KPIs component for network admin analytics. Presentational component
 * to show multiple KPI cards.
 */
@Component({
  selector: 'm-networkAdminAnalytics__kpis',
  styleUrls: ['./kpis.component.ng.scss'],
  template: `
    <m-networkAdminAnalytics__kpiCard
      *ngFor="let kpi of data; trackByFn"
      [value]="kpi.value"
      [metric]="kpi.metric"
    ></m-networkAdminAnalytics__kpiCard>
  `,
})
export class NetworkAdminAnalyticsKpisComponent {
  /** KPI data to be displayed. */
  @Input() protected data: AnalyticsKpiType[];

  /**
   * Track by function for change detection tracking in template for loop.
   * @param { AnalyticsKpiType } kpi - KPI data.
   * @returns { AnalyticsMetricEnum } - metric enum.
   */
  protected trackByFn(kpi: AnalyticsKpiType): AnalyticsMetricEnum {
    return kpi.metric;
  }
}
