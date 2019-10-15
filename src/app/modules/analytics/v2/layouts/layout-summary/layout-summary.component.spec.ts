import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLayoutSummaryComponent } from './layout-summary.component';

describe('AnalyticsLayoutSummaryComponent', () => {
  let component: AnalyticsLayoutSummaryComponent;
  let fixture: ComponentFixture<AnalyticsLayoutSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsLayoutSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsLayoutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
