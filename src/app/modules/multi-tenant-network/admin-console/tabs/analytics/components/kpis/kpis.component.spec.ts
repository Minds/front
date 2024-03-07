import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsKpisComponent } from './kpis.component';
import {
  AnalyticsKpiType,
  AnalyticsMetricEnum,
} from '../../../../../../../../graphql/generated.engine';
import { MockComponent } from '../../../../../../../utils/mock';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

const data: AnalyticsKpiType[] = [
  {
    metric: AnalyticsMetricEnum.DailyActiveUsers,
    previousPeriodValue: 100,
    value: 200,
  },
  {
    metric: AnalyticsMetricEnum.MeanSessionSecs,
    previousPeriodValue: 300,
    value: 400,
  },
  {
    metric: AnalyticsMetricEnum.NewUsers,
    previousPeriodValue: 400,
    value: 500,
  },
];

describe('NetworkAdminAnalyticsKpisComponent', () => {
  let comp: NetworkAdminAnalyticsKpisComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsKpisComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'm-networkAdminAnalytics__kpiCard',
          inputs: ['value', 'metric'],
        }),
        NetworkAdminAnalyticsKpisComponent,
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminAnalyticsKpisComponent);
    comp = fixture.componentInstance;

    (comp as any).data = data;

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

  it('should render kpi cards', () => {
    const kpiCardElements: DebugElement[] = fixture.debugElement.queryAll(
      By.css('m-networkAdminAnalytics__kpiCard')
    );
    expect(kpiCardElements.length).toBe(data.length);
  });

  it('should track by metric', () => {
    expect((comp as any).trackByFn(data[0])).toBe(data[0].metric);
  });
});
