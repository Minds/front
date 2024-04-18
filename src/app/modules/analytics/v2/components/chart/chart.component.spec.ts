import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalyticsChartComponent } from './chart.component';

describe('AnalyticsChartComponent', () => {
  let component: AnalyticsChartComponent;
  let fixture: ComponentFixture<AnalyticsChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
