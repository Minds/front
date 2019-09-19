import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsFiltersGridComponent } from './filters-grid.component';

describe('AnalyticsFiltersGridComponent', () => {
  let component: AnalyticsFiltersGridComponent;
  let fixture: ComponentFixture<AnalyticsFiltersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsFiltersGridComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsFiltersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
