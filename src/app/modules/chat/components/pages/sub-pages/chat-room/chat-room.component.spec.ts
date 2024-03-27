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
              inputs: ['roomMembers', 'requestMode'],
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

  it('should init', () => {
    expect(comp).toBeTruthy();
    expect(
      (comp as any).singleChatRoomService.setRoomGuid
    ).toHaveBeenCalledWith(ROOM_ID);
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
  });

  it('navigate to rooms page if appropriate', fakeAsync(() => {
    const chatRoom: ChatRoomEdge = mockChatRoomEdge;
    chatRoom.node.isChatRequest = false;
    (comp as any).requestMode = true;

    (comp as any).handleChatRoomInit();
    tick();

    expect((comp as any).router.navigate).toHaveBeenCalledWith(
      [`/chat/rooms/${ROOM_ID}`],
      {
        relativeTo: (comp as any).route,
      }
    );
  }));

  it('navigate to requests page if appropriate', fakeAsync(() => {
    const chatRoom: ChatRoomEdge = mockChatRoomEdge;
    chatRoom.node.isChatRequest = true;
    (comp as any).requestMode = false;

    (comp as any).handleChatRoomInit();
    tick();

    expect((comp as any).router.navigate).toHaveBeenCalledWith(
      [`/chat/requests/${ROOM_ID}`],
      {
        relativeTo: (comp as any).route,
      }
    );
  }));
});
