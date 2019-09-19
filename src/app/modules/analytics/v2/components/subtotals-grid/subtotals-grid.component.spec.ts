import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSubtotalsGridComponent } from './subtotals-grid.component';

describe('SubtotalsComponent', () => {
  let component: AnalyticsSubtotalsGridComponent;
  let fixture: ComponentFixture<AnalyticsSubtotalsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsSubtotalsGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSubtotalsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
