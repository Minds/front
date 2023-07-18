import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownvoteNoticeComponent } from './downvote-notice.component';

describe('DownvoteNoticeComponent', () => {
  let component: DownvoteNoticeComponent;
  let fixture: ComponentFixture<DownvoteNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownvoteNoticeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DownvoteNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
