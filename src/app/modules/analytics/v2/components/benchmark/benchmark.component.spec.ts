import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsBenchmarkComponent } from './benchmark.component';

describe('AnalyticsBenchmarkComponent', () => {
  let component: AnalyticsBenchmarkComponent;
  let fixture: ComponentFixture<AnalyticsBenchmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsBenchmarkComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsBenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
