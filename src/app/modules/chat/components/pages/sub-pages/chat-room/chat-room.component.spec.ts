import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomComponent } from './chat-room.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { SingleChatRoomService } from '../../../../services/single-chat-room.service';
import { ChatMessagesService } from '../../../../services/chat-messages.service';
import { ChatRoomMembersService } from '../../../../services/chat-room-members.service';
import { TotalChatRoomMembersService } from '../../../../services/total-chat-room-members.service';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { ChatwootWidgetService } from '../../../../../../common/components/chatwoot-widget/chatwoot-widget.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { WINDOW } from '../../../../../../common/injection-tokens/common-injection-tokens';
import { BehaviorSubject } from 'rxjs';
import {
  ChatMessageEdge,
  ChatRoomEdge,
} from '../../../../../../../graphql/generated.engine';
import {
  mockChatMessageEdge,
  mockChatRoomEdge,
} from '../../../../../../mocks/chat.mock';
import { AnalyticsService } from '../../../../../../services/analytics';

const ROOM_ID: string = '123';

describe('ChatRoomComponent', () => {
  let comp: ChatRoomComponent;
  let fixture: ComponentFixture<ChatRoomComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomComponent],
      providers: [
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    data: { requestMode: true },
                    paramMap: convertToParamMap({ roomId: ROOM_ID }),
                  };
                },
              },
            },
          }),
        },
        {
          provide: ChatwootWidgetService,
          useValue: MockService(ChatwootWidgetService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
        {
          provide: WINDOW,
          useValue: jasmine.createSpyObj<Window>([
            'removeEventListener',
            'addEventListener',
          ]),
        },
      ],
    })
      .overrideProvider(SingleChatRoomService, {
        useValue: MockService(SingleChatRoomService, {
          has: ['chatRoom$'],
          props: {
            chatRoom$: {
              get: () => new BehaviorSubject<ChatRoomEdge>(mockChatRoomEdge),
            },
          },
        }),
      })
      .overrideProvider(ChatMessagesService, {
        useValue: MockService(ChatMessagesService, {
          has: ['edges$', 'initialized$'],
          props: {
            edges$: {
              get: () =>
                new BehaviorSubject<ChatMessageEdge[]>([mockChatMessageEdge]),
            },
            initialized$: {
              get: () => new BehaviorSubject<boolean>(true),
            },
          },
        }),
      })
      .overrideProvider(ChatRoomMembersService, {
        useValue: MockService(ChatRoomMembersService),
      })
      .overrideProvider(TotalChatRoomMembersService, {
        useValue: MockService(TotalChatRoomMembersService),
      })
      .overrideComponent(ChatRoomComponent, {
        set: {
          imports: [
            NgCommonModule,
            MockComponent({
              selector: 'm-chatRoom__details',
              inputs: ['roomGuid'],
              outputs: ['backClick'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-chatRoom__top',
              inputs: ['chatRoomEdge'],
              outputs: ['detailsIconClick'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-chatRoom__messages',
              inputs: ['messages'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-chatRoom__bottom',
              inputs: ['roomGuid'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-loadingSpinner',
              inputs: ['inProgress'],
              standalone: true,
            }),
            MockComponent({
              selector: 'm-chatRoom__bottom--request',
              inputs: ['roomGuid', 'roomType'],
              standalone: true,
            }),
          ],
        },
      });

    fixture = TestBed.createComponent(ChatRoomComponent);
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

  it('should init', fakeAsync(() => {
    expect(comp).toBeTruthy();
    expect((comp as any).singleChatRoomService.init).toHaveBeenCalledWith(
      ROOM_ID
    );
    expect(
      (comp as any).totalChatRoomMembersService.setRoomGuid
    ).toHaveBeenCalledWith(ROOM_ID);
    expect((comp as any).chatMessagesService.init).toHaveBeenCalledWith(
      ROOM_ID
    );
    expect((comp as any).window.addEventListener).toHaveBeenCalledWith(
      'chatwoot:ready',
      jasmine.any(Function),
      false
    );
    tick();

    expect(
      (comp as any).analyticsService.setGlobalProperty
    ).toHaveBeenCalledWith('chat_room_guid', mockChatRoomEdge.node.guid);
    expect(
      (comp as any).analyticsService.setGlobalProperty
    ).toHaveBeenCalledWith('chat_room_type', mockChatRoomEdge.node.roomType);
    expect(
      (comp as any).analyticsService.setGlobalProperty
    ).toHaveBeenCalledWith(
      'chat_last_message_created_timestamp',
      new Date(
        mockChatRoomEdge?.lastMessageCreatedTimestamp * 1000
      ).toISOString()
    );
    expect((comp as any).analyticsService.trackView).toHaveBeenCalledOnceWith(
      'chat_room_view'
    );
  }));

  describe('ngOnDestroy', () => {
    it('should unset global analytic properties', () => {
      comp.ngOnDestroy();

      expect(
        (comp as any).analyticsService.setGlobalProperty
      ).toHaveBeenCalledWith('chat_room_guid', undefined);
      expect(
        (comp as any).analyticsService.setGlobalProperty
      ).toHaveBeenCalledWith('chat_room_type', undefined);
      expect(
        (comp as any).analyticsService.setGlobalProperty
      ).toHaveBeenCalledWith('chat_last_message_created_timestamp', undefined);
    });
  });
});
