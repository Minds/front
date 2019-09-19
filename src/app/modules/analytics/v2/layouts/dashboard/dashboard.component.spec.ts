import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLayoutDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: AnalyticsLayoutDashboardComponent;
  let fixture: ComponentFixture<AnalyticsLayoutDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsLayoutDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsLayoutDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
