import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomListItemComponent } from './room-list-item.component';
import { mockChatRoomEdge } from '../../../../../mocks/chat.mock';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ChatRoomUtilsService } from '../../../services/utils.service';
import { Router } from '@angular/router';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChatDatePipe } from '../../../pipes/chat-date-pipe';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

describe('ChatRoomListItemComponent', () => {
  let comp: ChatRoomListItemComponent;
  let fixture: ComponentFixture<ChatRoomListItemComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomListItemComponent],
      providers: [
        {
          provide: ChatRoomUtilsService,
          useValue: MockService(ChatRoomUtilsService),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: WINDOW, useValue: jasmine.createSpyObj<Window>(['open']) },
      ],
    }).overrideComponent(ChatRoomListItemComponent, {
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

    fixture = TestBed.createComponent(ChatRoomListItemComponent);
    comp = fixture.componentInstance;

    comp.edge = mockChatRoomEdge;

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

  it('should get avatar objects array sliced at max length', () => {
    expect(
      (comp as any).getAvatarObjects([
        mockChatRoomEdge.members.edges[0],
        mockChatRoomEdge.members.edges[1],
        mockChatRoomEdge.members.edges[0],
        mockChatRoomEdge.members.edges[1],
        mockChatRoomEdge.members.edges[0],
      ])
    ).toEqual([
      {
        guid: mockChatRoomEdge.members.edges[0].node.guid,
        type: 'user',
        username: mockChatRoomEdge.members.edges[0].node.username,
      },
      {
        guid: mockChatRoomEdge.members.edges[1].node.guid,
        type: 'user',
        username: mockChatRoomEdge.members.edges[1].node.username,
      },
    ]);
  });

  it('should navigate to chat room', () => {
    (comp as any).navigateToChat();
    expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
      `/chat/rooms/${mockChatRoomEdge.node.guid}`
    );
  });
});
