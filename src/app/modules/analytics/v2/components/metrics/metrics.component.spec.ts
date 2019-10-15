import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMetricsComponent } from './metrics.component';

describe('AnalyticsMetricsComponent', () => {
  let component: AnalyticsMetricsComponent;
  let fixture: ComponentFixture<AnalyticsMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsMetricsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
