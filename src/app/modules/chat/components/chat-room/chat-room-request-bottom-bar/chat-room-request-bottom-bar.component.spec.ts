import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomRequestBottomBarComponent } from './chat-room-request-bottom-bar.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../utils/mock';
import {
  ChatRoomInviteRequestActionEnum,
  ReplyToRoomInviteRequestGQL,
} from '../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ChatRequestsListService } from '../../../services/chat-requests-list.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ChatRoomRequestBottomBarComponent', () => {
  let comp: ChatRoomRequestBottomBarComponent;
  let fixture: ComponentFixture<ChatRoomRequestBottomBarComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomRequestBottomBarComponent],
      providers: [
        {
          provide: ReplyToRoomInviteRequestGQL,
          useValue: jasmine.createSpyObj<ReplyToRoomInviteRequestGQL>([
            'mutate',
          ]),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ChatRequestsListService,
          useValue: MockService(ChatRequestsListService),
        },
        { provide: Router, useValue: MockService(Router) },
      ],
    }).overrideComponent(ChatRoomRequestBottomBarComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-sizeableLoadingSpinner',
            inputs: ['inProgress', 'spinnerHeight', 'spinnerWeight'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomRequestBottomBarComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'error'); // suppress console.error

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

  describe('onBlockClick', () => {
    it('should handle block click', fakeAsync(() => {
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          data: {
            replyToRoomInviteRequest: true,
          },
        })
      );
      (comp as any).onBlockClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.RejectAndBlock,
      });
      expect((comp as any).blockInProgress$.getValue()).toBeFalse();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'User has been blocked'
      );
      expect((comp as any).chatRequestsListService.refetch).toHaveBeenCalled();
    }));

    it('should errors during block click', fakeAsync(() => {
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          errors: [{ message: 'error message' }],
        })
      );
      (comp as any).onBlockClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.RejectAndBlock,
      });
      expect((comp as any).blockInProgress$.getValue()).toBeFalse();
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect(
        (comp as any).chatRequestsListService.refetch
      ).not.toHaveBeenCalled();
    }));
  });

  describe('onRejectClick', () => {
    it('should handle reject click', fakeAsync(() => {
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          data: {
            replyToRoomInviteRequest: true,
          },
        })
      );
      (comp as any).onRejectClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.Reject,
      });
      expect((comp as any).rejectInProgress$.getValue()).toBeFalse();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Request rejected'
      );
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/chat/requests'
      );
    }));

    it('should errors during reject click', fakeAsync(() => {
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          errors: [{ message: 'error message' }],
        })
      );
      (comp as any).onRejectClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.Reject,
      });
      expect((comp as any).rejectInProgress$.getValue()).toBeFalse();
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));
  });

  describe('onAcceptClick', () => {
    it('should handle accept click', fakeAsync(() => {
      (comp as any).roomGuid = '123456';
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          data: {
            replyToRoomInviteRequest: true,
          },
        })
      );
      (comp as any).onAcceptClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.Accept,
      });
      expect((comp as any).acceptInProgress$.getValue()).toBeFalse();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/chat/rooms/123456'
      );
    }));

    it('should errors during accept click', fakeAsync(() => {
      (comp as any).replyToRoomInviteRequestGql.mutate.and.returnValue(
        of({
          errors: [{ message: 'error message' }],
        })
      );
      (comp as any).onAcceptClick();
      tick();

      expect(
        (comp as any).replyToRoomInviteRequestGql.mutate
      ).toHaveBeenCalledWith({
        roomGuid: (comp as any).roomGuid,
        action: ChatRoomInviteRequestActionEnum.Accept,
      });
      expect((comp as any).acceptInProgress$.getValue()).toBeFalse();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));
  });
});
