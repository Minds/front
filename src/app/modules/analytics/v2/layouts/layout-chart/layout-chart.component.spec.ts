import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLayoutChartComponent } from './layout-chart.component';

describe('AnalyticsLayoutChartComponent', () => {
  let component: AnalyticsLayoutChartComponent;
  let fixture: ComponentFixture<AnalyticsLayoutChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsLayoutChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsLayoutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
