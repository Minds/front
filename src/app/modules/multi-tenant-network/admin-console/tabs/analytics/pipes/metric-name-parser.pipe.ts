import { Pipe } from '@angular/core';
import { AnalyticsMetricEnum } from '../../../../../../../graphql/generated.engine';

/**
 * Pipe to transform a metric enum into a user friendly display name.
 */
@Pipe({
  name: 'metricNameParser',
  standalone: true,
})
export class MetricNameParserPipe {
  /**
   * Transform a metric enum into a user friendly display name.
   * @returns { string } user friendly display name.
   */
  public transform(metric: AnalyticsMetricEnum): string {
    switch (metric) {
      case AnalyticsMetricEnum.DailyActiveUsers:
        return 'Daily active users';
      case AnalyticsMetricEnum.MeanSessionSecs:
        return 'Average session time';
      case AnalyticsMetricEnum.NewUsers:
        return 'New users';
      case AnalyticsMetricEnum.TotalSiteMembershipSubscriptions:
        return 'Total memberships';
      case AnalyticsMetricEnum.TotalUsers:
        return 'Total users';
      case AnalyticsMetricEnum.Visitors:
        return 'Site visits';
      default:
        console.warn('Unknown metric', metric);
        return metric;
    }
  }
}
