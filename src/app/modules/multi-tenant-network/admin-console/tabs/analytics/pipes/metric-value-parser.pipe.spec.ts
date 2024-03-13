import { AnalyticsMetricEnum } from '../../../../../../../graphql/generated.engine';
import { MetricValueParserPipe } from './metric-value-parser.pipe';
import * as moment from 'moment';

describe('MetricValueParserPipe', () => {
  const pipe: MetricValueParserPipe = new MetricValueParserPipe();

  it('should transform DailyActiveUsers', () => {
    expect(pipe.transform(123, AnalyticsMetricEnum.DailyActiveUsers)).toBe(
      '123'
    );
  });

  describe('MeanSessionSecs', () => {
    it('should transform MeanSessionSecs for hours', () => {
      expect(
        pipe.transform(
          moment.duration(23, 'hours').asSeconds(),
          AnalyticsMetricEnum.MeanSessionSecs
        )
      ).toBe('23 hr');
    });

    it('should transform MeanSessionSecs for minutes', () => {
      expect(
        pipe.transform(
          moment.duration(59, 'minutes').asSeconds(),
          AnalyticsMetricEnum.MeanSessionSecs
        )
      ).toBe('59 min');
    });

    it('should transform MeanSessionSecs for seconds', () => {
      expect(
        pipe.transform(
          moment.duration(59, 'seconds').asSeconds(),
          AnalyticsMetricEnum.MeanSessionSecs
        )
      ).toBe('59 sec');
    });
  });

  it('should transform NewUsers', () => {
    expect(pipe.transform(123, AnalyticsMetricEnum.NewUsers)).toBe('123');
  });

  it('should transform TotalSiteMembershipSubscriptions', () => {
    expect(
      pipe.transform(123, AnalyticsMetricEnum.TotalSiteMembershipSubscriptions)
    ).toBe('123');
  });

  it('should transform TotalUsers', () => {
    expect(pipe.transform(123, AnalyticsMetricEnum.TotalUsers)).toBe('123');
  });

  it('should transform Visitors', () => {
    expect(pipe.transform(123, AnalyticsMetricEnum.Visitors)).toBe('123');
  });
});
