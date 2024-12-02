import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatRoomMessageDropdownComponent } from './chat-room-message-dropdown.component';
import { MockDirective, MockService } from '../../../../../../../utils/mock';
import { ChatMessagesService } from '../../../../../services/chat-messages.service';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { CommonModule as NgCommonModule } from '@angular/common';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { ReportCreatorComponent } from '../../../../../../report/creator/creator.component';
import { SingleChatRoomService } from '../../../../../services/single-chat-room.service';
import { BehaviorSubject } from 'rxjs';
import {
  ChatRoomEdge,
  ChatRoomTypeEnum,
} from '../../../../../../../../graphql/generated.engine';
import { mockChatRoomEdge } from '../../../../../../../mocks/chat.mock';
import { NgxFloatUiModule } from 'ngx-float-ui';

describe('ChatRoomMessageDropdownComponent', () => {
  let comp: ChatRoomMessageDropdownComponent;
  let fixture: ComponentFixture<ChatRoomMessageDropdownComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomMessageDropdownComponent],
      providers: [
        { provide: ModalService, useValue: MockService(ModalService) },
        {
          provide: ChatMessagesService,
          useValue: MockService(ChatMessagesService),
        },
        {
          provide: SingleChatRoomService,
          useValue: MockService(SingleChatRoomService, {
            has: ['chatRoom$'],
            props: {
              chatRoom$: {
                get: () => new BehaviorSubject<ChatRoomEdge>(mockChatRoomEdge),
              },
            },
          }),
        },
      ],
    }).overrideComponent(ChatRoomMessageDropdownComponent, {
      set: {
        imports: [
          NgCommonModule,
          NgxFloatUiModule,
          MockDirective({
            selector: 'showOnHover',
            inputs: [
              'hoverSourceElement',
              'forceShow',
              'reactToForceShowChange',
            ],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatRoomMessageDropdownComponent);
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

  it('should handle on popper shown', () => {
    (comp as any).dropdownMenuShown = false;
    (comp as any).onFloatUiShown();
    expect((comp as any).dropdownMenuShown).toBe(true);
  });

  it('should handle on popper hidden', () => {
    (comp as any).dropdownMenuShown = true;
    (comp as any).onFloatUiHidden();
    expect((comp as any).dropdownMenuShown).toBe(false);
  });

  it('should handle report click', () => {
    (comp as any).messageEdge = {
      node: { id: '123' },
    };
    (comp as any).onReportClick();

    expect((comp as any).modalService.present).toHaveBeenCalledWith(
      ReportCreatorComponent,
      {
        data: {
          entity: {
            urn: '123',
            id: '123',
          },
        },
      }
    );
  });

  it('should handle delete click', () => {
    (comp as any).messageEdge = { node: { id: '123' } };
    (comp as any).onDeleteClick();
    expect(
      (comp as any).chatMessageService.removeChatMessage
    ).toHaveBeenCalledWith((comp as any).messageEdge);
  });

  describe('canModerate', () => {
    it('should return true if the user can moderate', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = true;

      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).canModerate$.subscribe((canModerate: boolean) => {
        expect(canModerate).toBe(true);
        done();
      });
    });

    it('should return false if the user cannot moderate because the room is not group owned', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.OneToOne;
      chatRoomEdge.node.isUserRoomOwner = true;

      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).canModerate$.subscribe((canModerate: boolean) => {
        expect(canModerate).toBe(false);
        done();
      });
    });

    it('should return false if the user cannot moderate because the user is not the owner of the group room', (done: DoneFn) => {
      let chatRoomEdge: ChatRoomEdge = mockChatRoomEdge;
      chatRoomEdge.node.roomType = ChatRoomTypeEnum.GroupOwned;
      chatRoomEdge.node.isUserRoomOwner = false;

      (comp as any).singleChatRoomService.chatRoom$.next(chatRoomEdge);

      (comp as any).canModerate$.subscribe((canModerate: boolean) => {
        expect(canModerate).toBe(false);
        done();
      });
    });
  });
});
