import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsFilterComponent } from './filter.component';

describe('AnalyticsFilterComponent', () => {
  let component: AnalyticsFilterComponent;
  let fixture: ComponentFixture<AnalyticsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsFilterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
