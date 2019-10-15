import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTableComponent } from './table.component';

describe('AnalyticsTableComponent', () => {
  let component: AnalyticsTableComponent;
  let fixture: ComponentFixture<AnalyticsTableComponent>;

  beforeEach(async(() => {
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
