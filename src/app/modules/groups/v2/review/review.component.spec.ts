import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupReviewComponent } from './review.component';

describe('GroupReviewComponent', () => {
  let component: GroupReviewComponent;
  let fixture: ComponentFixture<GroupReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupReviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
