import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnalyticsTableComponent } from './table.component';

describe('AnalyticsTableComponent', () => {
  let component: AnalyticsTableComponent;
  let fixture: ComponentFixture<AnalyticsTableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
