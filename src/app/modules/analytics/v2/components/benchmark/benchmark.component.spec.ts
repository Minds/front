import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TooltipComponentMock } from '../../../../../mocks/common/components/tooltip/tooltip.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AnalyticsBenchmarkComponent } from './benchmark.component';

describe('AnalyticsBenchmarkComponent', () => {
  let component: AnalyticsBenchmarkComponent;
  let fixture: ComponentFixture<AnalyticsBenchmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsBenchmarkComponent, TooltipComponentMock],
      // schemas: [NO_ERRORS_SCHEMA],
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
