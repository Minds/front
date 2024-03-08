import { Pipe } from '@angular/core';
import { AnalyticsMetricEnum } from '../../../../../../../graphql/generated.engine';
import * as moment from 'moment';

/**
 * Pipe for parsing metric values into human readable strings.
 */
@Pipe({
  name: 'metricValueParser',
  standalone: true,
})
export class MetricValueParserPipe {
  /**
   * Transforms a metric value into a human readable string.
   * @param { string | number } value - value to transform.
   * @param { AnalyticsMetricEnum } metric - the metric that you are transforming for.
   * @returns { string } - the transformed value.
   */
  public transform(
    value: string | number,
    metric: AnalyticsMetricEnum
  ): string {
    switch (metric) {
      case AnalyticsMetricEnum.NewUsers:
      case AnalyticsMetricEnum.DailyActiveUsers:
      case AnalyticsMetricEnum.TotalSiteMembershipSubscriptions:
      case AnalyticsMetricEnum.Visitors:
      case AnalyticsMetricEnum.TotalUsers:
        return value.toString();
      case AnalyticsMetricEnum.MeanSessionSecs:
        const meanSessionSeconds: moment.Duration = moment.duration(
          value,
          'seconds'
        );
        const hours: number = meanSessionSeconds.asHours();

        if (hours && hours >= 1) {
          return `${Math.floor(hours)} hr`;
        }

        const minutes: number = meanSessionSeconds.asMinutes();

        if (minutes && minutes >= 1) {
          return `${Math.floor(minutes)} min`;
        }

        const seconds: number = meanSessionSeconds.asSeconds();

        if (seconds && seconds >= 1) {
          return `${Math.floor(seconds)} sec`;
        }

        return '0 min';
      default:
        console.warn('Unknown metric', metric);
        return value.toString();
    }
  }
}
