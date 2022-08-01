import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityV2BoostedFlagComponent } from './boosted-flag.component';

describe('BoostedFlagComponent', () => {
  let component: ActivityV2BoostedFlagComponent;
  let fixture: ComponentFixture<ActivityV2BoostedFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityV2BoostedFlagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityV2BoostedFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
