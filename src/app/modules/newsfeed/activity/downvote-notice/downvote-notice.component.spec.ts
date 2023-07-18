import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDownvoteNoticeComponent } from './downvote-notice.component';
import { ToasterService } from '../../../../common/services/toaster.service';
import { MockService } from '../../../../utils/mock';
import { ApiService } from '../../../../common/api/api.service';

describe('DownvoteNoticeComponent', () => {
  let component: ActivityDownvoteNoticeComponent;
  let fixture: ComponentFixture<ActivityDownvoteNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityDownvoteNoticeComponent],
      providers: [
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityDownvoteNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
