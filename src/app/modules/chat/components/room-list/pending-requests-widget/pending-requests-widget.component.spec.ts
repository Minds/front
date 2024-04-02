import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatPendingRequestsWidgetComponent } from './pending-requests-widget.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { Router } from '@angular/router';
import { TotalChatRoomInviteRequestsService } from '../../../services/total-chat-room-invite-requests.service';
import { BehaviorSubject } from 'rxjs';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';

describe('ChatPendingRequestsWidgetComponent', () => {
  let comp: ChatPendingRequestsWidgetComponent;
  let fixture: ComponentFixture<ChatPendingRequestsWidgetComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatPendingRequestsWidgetComponent],
      providers: [
        {
          provide: Router,
          useValue: MockService(Router),
        },
        {
          provide: TotalChatRoomInviteRequestsService,
          useValue: MockService(TotalChatRoomInviteRequestsService, {
            has: ['totalRequests$'],
            props: {
              totalRequests$: {
                get: () => new BehaviorSubject<number>(10),
              },
            },
          }),
        },
      ],
    }).overrideComponent(ChatPendingRequestsWidgetComponent, {
      set: {
        imports: [
          NgCommonModule,
          ChatDatePipe,
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatPendingRequestsWidgetComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle pending requests click', () => {
    (comp as any).onPendingRequestsWidgetClick();
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/chat/requests'
    );
  });

  it('should not show total requests when there are no requests', () => {
    (comp as any).totalRequests$.next(0);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(
        '.m-chatPendingRequestsWidget__container'
      )
    ).toBeNull();
  });

  it('should not show total requests when there are no requests', () => {
    (comp as any).totalRequests$.next(1);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector(
        '.m-chatPendingRequestsWidget__container'
      )
    ).toBeTruthy();
  });
});
