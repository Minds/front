import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDownvoteNoticeComponent } from './downvote-notice.component';

describe('DownvoteNoticeComponent', () => {
  let component: ActivityDownvoteNoticeComponent;
  let fixture: ComponentFixture<ActivityDownvoteNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityDownvoteNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityDownvoteNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
