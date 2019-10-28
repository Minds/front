import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsMenuComponent } from './menu.component';

describe('AnalyticsMenuComponent', () => {
  let component: AnalyticsMenuComponent;
  let fixture: ComponentFixture<AnalyticsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsMenuComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
