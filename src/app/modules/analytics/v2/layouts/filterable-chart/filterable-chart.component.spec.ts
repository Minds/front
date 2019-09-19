import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableChartComponent } from './filterable-chart.component';

describe('FilterableChartComponent', () => {
  let component: FilterableChartComponent;
  let fixture: ComponentFixture<FilterableChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterableChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterableChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
