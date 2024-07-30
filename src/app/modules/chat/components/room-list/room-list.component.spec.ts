import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomListComponent } from './room-list.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../utils/mock';
import { StartChatModalService } from '../start-chat-modal/start-chat-modal.service';
import { ChatRoomsListService } from '../../services/chat-rooms-list.service';
import { TotalChatRoomInviteRequestsService } from '../../services/total-chat-room-invite-requests.service';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  convertToParamMap,
} from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { PageInfo } from '../../../../../graphql/generated.engine';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';

const ROOM_ID: string = '1234567890';

describe('ChatRoomListComponent', () => {
  let comp: ChatRoomListComponent;
  let fixture: ComponentFixture<ChatRoomListComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomListComponent],
      providers: [
        {
          provide: StartChatModalService,
          useValue: MockService(StartChatModalService),
        },
        {
          provide: ChatRoomsListService,
          useValue: MockService(ChatRoomsListService, {
            has: ['initialized$', 'inProgress$', 'pageInfo$'],
            props: {
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
                    endCursor: '1234567890',
                    startCursor: '0987654321',
                    hasPreviousPage: false,
                  }),
              },
            },
          }),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: Router,
          useValue: MockService(Router, {
            has: ['events'],
            props: {
              events: {
                get: () => {
                  return new BehaviorSubject<RouterEvent>(null);
                },
              },
            },
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: MockService(ActivatedRoute, {
            has: ['snapshot'],
            props: {
              snapshot: {
                get: () => {
                  return {
                    firstChild: {
                      params: convertToParamMap({ roomId: ROOM_ID }),
                    },
                  };
                },
              },
            },
          }),
        },
      ],
    })
      .overrideProvider(TotalChatRoomInviteRequestsService, {
        useValue: MockService(TotalChatRoomInviteRequestsService, {
          has: ['totalRequests$', 'initialized$'],
          props: {
            totalRequests$: {
              get: () => new BehaviorSubject<number>(10),
            },
            initialized$: {
              get: () => new BehaviorSubject<boolean>(true),
            },
          },
        }),
      })
      .overrideComponent(ChatRoomListComponent, {
        set: {
          imports: [
            NgCommonModule,
            MockComponent({
              selector: 'm-chatPendingRequests__widget',
              standalone: true,
            }),
            MockComponent({
              selector: 'm-chat__roomListItem',
              inputs: ['edge', 'active'],
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
              selector: 'm-chat__actionCard',
              inputs: [
                'headerText',
                'descriptionText',
                'ctaText',
                'headerSize',
                'descriptionSize',
              ],
              outputs: ['actionButtonClick'],
              standalone: true,
            }),
          ],
        },
      });

    fixture = TestBed.createComponent(ChatRoomListComponent);
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
    expect((comp as any).chatRoomsListService.init).toHaveBeenCalled();
    expect((comp as any).totalChatRequestsService.init).toHaveBeenCalled();
    expect(
      (comp as any).chatRoomsListService.setIsViewingChatRoomList
    ).toHaveBeenCalledWith(true);
  });

  describe('canShowStartChatButton', () => {
    it('should determine whether the start chat button should be shown', () => {
      (comp as any).permissionIntentsService.shouldHide.and.returnValue(false);
      comp.ngOnInit();
      expect((comp as any).canShowStartChatButton).toBeTrue();

      (comp as any).permissionIntentsService.shouldHide.and.returnValue(true);
      comp.ngOnInit();
      expect((comp as any).canShowStartChatButton).toBeFalse();
    });
  });

  it('should set is viewing chat room to false on destroy', () => {
    comp.ngOnDestroy();
    expect(
      (comp as any).chatRoomsListService.setIsViewingChatRoomList
    ).toHaveBeenCalledWith(false);
  });

  it('should set current room ID on navigation end', fakeAsync(() => {
    (comp as any).currentRoomId$.next('');
    (comp as any).route.snapshot.firstChild.params['roomId'] = ROOM_ID;
    (comp as any).router.events.next(new NavigationEnd(1, '/', '/'));

    tick();

    expect((comp as any).currentRoomId$.getValue()).toBe(ROOM_ID);
  }));

  it('should fetch more', () => {
    (comp as any).fetchMore();
    expect((comp as any).chatRoomsListService.fetchMore).toHaveBeenCalled();
  });

  it('should handle start chat click and refetch on success', fakeAsync(() => {
    (comp as any).permissionIntentsService.checkAndHandleAction.and.returnValue(
      true
    );
    (comp as any).startChatModal.open.and.returnValue(Promise.resolve(true));
    (comp as any).onStartChatClick(ROOM_ID);

    tick();

    expect((comp as any).startChatModal.open).toHaveBeenCalledWith(true);
    expect((comp as any).chatRoomsListService.refetch).toHaveBeenCalled();
    expect(
      (comp as any).permissionIntentsService.checkAndHandleAction
    ).toHaveBeenCalled();
  }));

  it('should handle start chat click and NOT refetch on failure', fakeAsync(() => {
    (comp as any).permissionIntentsService.checkAndHandleAction.and.returnValue(
      true
    );
    (comp as any).startChatModal.open.and.returnValue(Promise.resolve(false));
    (comp as any).onStartChatClick(ROOM_ID);

    tick();

    expect((comp as any).startChatModal.open).toHaveBeenCalledWith(true);
    expect((comp as any).chatRoomsListService.refetch).not.toHaveBeenCalled();
    expect(
      (comp as any).permissionIntentsService.checkAndHandleAction
    ).toHaveBeenCalled();
  }));

  it('should handle start chat click and show toast if user does not have correct permission ', fakeAsync(() => {
    (comp as any).permissionIntentsService.checkAndHandleAction.and.returnValue(
      false
    );
    (comp as any).startChatModal.open.and.returnValue(Promise.resolve(true));
    (comp as any).onStartChatClick(ROOM_ID);

    tick();

    expect((comp as any).startChatModal.open).not.toHaveBeenCalled();
    expect((comp as any).chatRoomsListService.refetch).not.toHaveBeenCalled();
    expect(
      (comp as any).permissionIntentsService.checkAndHandleAction
    ).toHaveBeenCalled();
  }));

  it('should get id as track by', () => {
    const id: string = '1234567890';
    expect((comp as any).trackBy({ node: { id: id } })).toBe(id);
  });
});
