import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSearchSuggestionsComponent } from './search-suggestions.component';

describe('AnalyticsSearchSuggestionsComponent', () => {
  let component: AnalyticsSearchSuggestionsComponent;
  let fixture: ComponentFixture<AnalyticsSearchSuggestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsSearchSuggestionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSearchSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
