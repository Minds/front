import { AnalyticsMetricEnum } from '../../../../../../../graphql/generated.engine';
import { MetricNameParserPipe } from './metric-name-parser.pipe';

describe('MetricNameParserPipe', () => {
  const pipe: MetricNameParserPipe = new MetricNameParserPipe();

  it('should transform DailyActiveUsers', () => {
    expect(pipe.transform(AnalyticsMetricEnum.DailyActiveUsers)).toBe(
      'Daily active users'
    );
  });

  it('should transform MeanSessionSecs', () => {
    expect(pipe.transform(AnalyticsMetricEnum.MeanSessionSecs)).toBe(
      'Average session time'
    );
  });

  it('should transform NewUsers', () => {
    expect(pipe.transform(AnalyticsMetricEnum.NewUsers)).toBe('New users');
  });

  it('should transform TotalSiteMembershipSubscriptions', () => {
    expect(
      pipe.transform(AnalyticsMetricEnum.TotalSiteMembershipSubscriptions)
    ).toBe('Total memberships');
  });

  it('should transform TotalUsers', () => {
    expect(pipe.transform(AnalyticsMetricEnum.TotalUsers)).toBe('Total users');
  });

  it('should transform Visitors', () => {
    expect(pipe.transform(AnalyticsMetricEnum.Visitors)).toBe('Site visits');
  });
});
