import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsDashboardComponent } from './dashboard.component';

describe('AnalyticsDashboardComponent', () => {
  let component: AnalyticsDashboardComponent;
  let fixture: ComponentFixture<AnalyticsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsDashboardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
