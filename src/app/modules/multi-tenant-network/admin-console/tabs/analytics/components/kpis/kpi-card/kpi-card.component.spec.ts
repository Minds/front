import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsKpiCardComponent } from './kpi-card.component';
import { MetricValueParserPipe } from '../../../pipes/metric-value-parser.pipe';
import { MetricNameParserPipe } from '../../../pipes/metric-name-parser.pipe';
import { AnalyticsMetricEnum } from '../../../../../../../../../graphql/generated.engine';

describe('NetworkAdminAnalyticsKpiCardComponent', () => {
  let comp: NetworkAdminAnalyticsKpiCardComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsKpiCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [MetricValueParserPipe, MetricNameParserPipe],
      declarations: [NetworkAdminAnalyticsKpiCardComponent],
    });

    fixture = TestBed.createComponent(NetworkAdminAnalyticsKpiCardComponent);
    comp = fixture.componentInstance;

    (comp as any).value = 100;
    (comp as any).metric = AnalyticsMetricEnum.DailyActiveUsers;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should have value and metric', () => {
    expect(
      fixture.nativeElement.querySelector('.m-kpiCard__value')
    ).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.m-kpiCard__metric')
    ).toBeTruthy();
  });
});
