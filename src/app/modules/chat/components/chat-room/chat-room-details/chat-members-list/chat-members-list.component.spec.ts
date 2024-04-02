import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { ChatMembersListComponent } from './chat-members-list.component';
import { ChatRoomMembersService } from '../../../../services/chat-room-members.service';
import { BehaviorSubject } from 'rxjs';
import {
  ChatRoomMemberEdge,
  PageInfo,
} from '../../../../../../../graphql/generated.engine';
import { mockChatMemberEdge } from '../../../../../../mocks/chat.mock';
import { CommonModule as NgCommonModule } from '@angular/common';

describe('ChatMembersListComponent', () => {
  let comp: ChatMembersListComponent;
  let fixture: ComponentFixture<ChatMembersListComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatMembersListComponent],
      providers: [
        {
          provide: ChatRoomMembersService,
          useValue: MockService(ChatRoomMembersService, {
            has: ['edges$', 'initialized$', 'inProgress$', 'pageInfo$'],
            props: {
              edges$: {
                get: () =>
                  new BehaviorSubject<ChatRoomMemberEdge[]>([
                    mockChatMemberEdge,
                  ] as ChatRoomMemberEdge[]),
              },
              initialized$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              inProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              pageInfo$: {
                get: () =>
                  new BehaviorSubject<PageInfo>({
                    hasNextPage: true,
                  } as PageInfo),
              },
            },
          }),
        },
      ],
    }).overrideComponent(ChatMembersListComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-chatRoom__membersListItem',
            inputs: ['memberEdge'],
            standalone: true,
          }),
          MockComponent({
            selector: 'infinite-scroll',
            inputs: [
              'moreData',
              'inProgress',
              'hideManual',
              'distance',
              'scrollSource',
            ],
            outputs: ['load'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-loadingSpinner',
            inputs: ['inProgress'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(ChatMembersListComponent);
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
      fixture.nativeElement.querySelector('m-chatRoom__membersListItem')
    ).toBeTruthy();
    expect(fixture.nativeElement.querySelector('infinite-scroll')).toBeTruthy();
  });

  it('should fetch more', () => {
    (comp as any).fetchMore();
    expect((comp as any).chatRoomMembersService.fetchMore).toHaveBeenCalled();
  });
});
