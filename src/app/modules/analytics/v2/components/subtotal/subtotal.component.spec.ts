import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsSubtotalComponent } from './subtotal.component';

describe('AnalyticsSubtotalComponent', () => {
  let component: AnalyticsSubtotalComponent;
  let fixture: ComponentFixture<AnalyticsSubtotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnalyticsSubtotalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsSubtotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
