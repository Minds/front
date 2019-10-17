import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsFiltersComponent } from './filters.component';

describe('AnalyticsFiltersComponent', () => {
  let component: AnalyticsFiltersComponent;
  let fixture: ComponentFixture<AnalyticsFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsFiltersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
