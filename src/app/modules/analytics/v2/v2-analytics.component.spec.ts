import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { V2AnalyticsComponent } from './v2-analytics.component';

describe('V2AnalyticsComponent', () => {
  let component: V2AnalyticsComponent;
  let fixture: ComponentFixture<V2AnalyticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ V2AnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(V2AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
