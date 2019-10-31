import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMiniChartComponent } from './analytics-mini-chart.component';

describe('AnalyticsMiniChartComponent', () => {
  let component: AnalyticsMiniChartComponent;
  let fixture: ComponentFixture<AnalyticsMiniChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsMiniChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsMiniChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
