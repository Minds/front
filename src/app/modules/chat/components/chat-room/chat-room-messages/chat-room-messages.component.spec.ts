import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomMessagesComponent } from './chat-room-messages.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ChatMessagesService } from '../../../services/chat-messages.service';
import { ChatReceiptService } from '../../../services/chat-receipt.service';
import { Session } from '../../../../../services/session';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageInfo } from '../../../../../../graphql/generated.engine';
import { mockChatMessageEdge } from '../../../../../mocks/chat.mock';
import userMock from '../../../../../mocks/responses/user.mock';

describe('ChatRoomMessagesComponent', () => {
  let comp: ChatRoomMessagesComponent;
  let fixture: ComponentFixture<ChatRoomMessagesComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMessagesComponent],
      providers: [
        {
          provide: ChatMessagesService,
          useValue: MockService(ChatMessagesService, {
            has: [
              'pageInfo$',
              'inProgress$',
              'initialized$',
              'scrollToBottom$',
              'hasNewMessage$',
            ],
            props: {
              pageInfo$: {
                get: () =>
                  new BehaviorSubject<PageInfo>({
                    hasNextPage: false,
                    hasPreviousPage: false,
                    endCursor: 'endCursor',
                    startCursor: 'startCursor',
                  }),
              },
              inProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              initialized$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              scrollToBottom$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              hasNewMessage$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ChatReceiptService,
          useValue: MockService(ChatReceiptService),
        },
        { provide: Session, useValue: MockService(Session) },
        ChangeDetectorRef,
      ],
    }).overrideComponent(ChatRoomMessagesComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-chatRoom__message',
            inputs: [
              'senderName',
              'plainText',
              'timeCreatedUnix',
              'senderGuid',
              'senderUsername',
              'isMessageOwner',
              'messageEdge',
              'richEmbed',
              'image',
              'isNextMessageFromSameSender',
              'isPreviousMessageFromSameSender',
            ],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomMessagesComponent);
    comp = fixture.componentInstance;

    (comp as any).messages = [mockChatMessageEdge];
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

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

  it('should update read receipt on scroll to bottom', fakeAsync(() => {
    spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

    (comp as any).scrollToBottom();
    tick();

    expect((comp as any).elementRef.nativeElement.scrollTo).toHaveBeenCalled();
  }));

  it('should scroll to bottom when service requests a scroll to bottom', fakeAsync(() => {
    spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

    (comp as any).chatMessagesService.scrollToBottom$.next(true);
    tick();

    expect((comp as any).elementRef.nativeElement.scrollTo).toHaveBeenCalled();
  }));

  it('should scroll to bottom when initialized', fakeAsync(() => {
    spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

    (comp as any).chatMessagesService.initialized$.next(true);
    comp.ngOnInit();
    tick();

    expect((comp as any).elementRef.nativeElement.scrollTo).toHaveBeenCalled();
  }));

  describe('updateReadReceipt', () => {
    it('should update read receipt on scroll to bottom', () => {
      (comp as any).scrollToBottom();

      expect((comp as any).chatReceiptService.update).toHaveBeenCalledWith(
        mockChatMessageEdge.node
      );
    });

    it('should NOT update read receipt when there are no messages', () => {
      (comp as any).chatReceiptService.update.calls.reset();
      (comp as any).messages = [];

      (comp as any).updateReadReceipt();

      expect((comp as any).chatReceiptService.update).not.toHaveBeenCalled();
    });
  });

  describe('fetchMore', () => {
    it('should fetch more', fakeAsync(() => {
      spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

      (comp as any).chatMessagesService.initialized$.next(true);
      (comp as any).chatMessagesService.pageInfo$.next({
        hasNextPage: false,
        hasPreviousPage: true,
        endCursor: 'endCursor',
        startCursor: 'startCursor',
      });
      (comp as any).chatMessagesService.inProgress$.next(false);
      tick();

      (comp as any).fetchMore();
      tick();

      (comp as any).chatMessagesService.inProgress$.next(true);
      tick();

      expect((comp as any).chatMessagesService.fetchMore).toHaveBeenCalled();
      expect(
        (comp as any).elementRef.nativeElement.scrollTo
      ).toHaveBeenCalled();
    }));

    it('should NOT fetch more if not initialized', fakeAsync(() => {
      spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

      (comp as any).chatMessagesService.initialized$.next(false);
      (comp as any).chatMessagesService.pageInfo$.next({
        hasNextPage: false,
        hasPreviousPage: true,
        endCursor: 'endCursor',
        startCursor: 'startCursor',
      });
      (comp as any).chatMessagesService.inProgress$.next(false);
      tick();

      (comp as any).fetchMore();
      tick();

      expect(
        (comp as any).chatMessagesService.fetchMore
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).elementRef.nativeElement.scrollTo
      ).not.toHaveBeenCalled();
    }));

    it('should NOT fetch more if in progress', fakeAsync(() => {
      spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

      (comp as any).chatMessagesService.initialized$.next(true);
      (comp as any).chatMessagesService.pageInfo$.next({
        hasNextPage: false,
        hasPreviousPage: true,
        endCursor: 'endCursor',
        startCursor: 'startCursor',
      });
      (comp as any).chatMessagesService.inProgress$.next(true);
      tick();

      (comp as any).fetchMore();
      tick();

      expect(
        (comp as any).chatMessagesService.fetchMore
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).elementRef.nativeElement.scrollTo
      ).not.toHaveBeenCalled();
    }));

    it("should NOT fetch more if there isn't a next page", fakeAsync(() => {
      spyOn((comp as any).elementRef.nativeElement, 'scrollTo');

      (comp as any).chatMessagesService.initialized$.next(true);
      (comp as any).chatMessagesService.pageInfo$.next({
        hasNextPage: false,
        hasPreviousPage: false,
        endCursor: 'endCursor',
        startCursor: 'startCursor',
      });
      (comp as any).chatMessagesService.inProgress$.next(false);
      tick();

      (comp as any).fetchMore();
      tick();

      expect(
        (comp as any).chatMessagesService.fetchMore
      ).not.toHaveBeenCalled();
      expect(
        (comp as any).elementRef.nativeElement.scrollTo
      ).not.toHaveBeenCalled();
    }));
  });

  describe('fetchNew', () => {
    it('should fetch new', fakeAsync(() => {
      (comp as any).fetchNew();
      tick();
      expect((comp as any).chatMessagesService.fetchNew).toHaveBeenCalled();
    }));
  });
});
