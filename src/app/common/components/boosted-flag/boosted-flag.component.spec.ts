import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostedFlagComponent } from './boosted-flag.component';

describe('BoostedFlagComponent', () => {
  let component: BoostedFlagComponent;
  let fixture: ComponentFixture<BoostedFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostedFlagComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostedFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
