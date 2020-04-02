import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSearchComponent } from './search.component';

describe('AnalyticsSearchComponent', () => {
  let component: AnalyticsSearchComponent;
  let fixture: ComponentFixture<AnalyticsSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsSearchComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
