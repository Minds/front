import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBoostedFlagComponent } from './boosted-flag.component';

describe('BoostedFlagComponent', () => {
  let component: ActivityBoostedFlagComponent;
  let fixture: ComponentFixture<ActivityBoostedFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityBoostedFlagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityBoostedFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
