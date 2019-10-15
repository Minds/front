import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLayoutTableComponent } from './layout-table.component';

describe('AnalyticsLayoutTableComponent', () => {
  let component: AnalyticsLayoutTableComponent;
  let fixture: ComponentFixture<AnalyticsLayoutTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsLayoutTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsLayoutTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
