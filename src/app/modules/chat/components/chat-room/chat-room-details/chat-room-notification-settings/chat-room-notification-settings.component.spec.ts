import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChatRoomNotificationSettingsComponent } from './chat-room-notification-settings.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { SingleChatRoomService } from '../../../../services/single-chat-room.service';
import { mockChatRoomEdge } from '../../../../../../mocks/chat.mock';
import { BehaviorSubject, of } from 'rxjs';
import {
  ChatRoomEdge,
  ChatRoomNotificationStatusEnum,
  UpdateChatRoomNotificationSettingsGQL,
} from '../../../../../../../graphql/generated.engine';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../../../../common/services/toaster.service';

describe('ChatRoomNotificationSettingsComponent', () => {
  let comp: ChatRoomNotificationSettingsComponent;
  let fixture: ComponentFixture<ChatRoomNotificationSettingsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ChatRoomNotificationSettingsComponent],
      providers: [
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
        {
          provide: UpdateChatRoomNotificationSettingsGQL,
          useValue: jasmine.createSpyObj<UpdateChatRoomNotificationSettingsGQL>(
            ['mutate']
          ),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).overrideComponent(ChatRoomNotificationSettingsComponent, {
      set: {
        imports: [
          NgCommonModule,
          MockComponent({
            selector: 'm-toggle',
            inputs: ['mModel', 'leftValue', 'rightValue', 'offState'],
            outputs: ['mModelChange'],
            standalone: true,
          }),
        ],
      },
    });

    spyOn(console, 'error'); // mute error logs

    fixture = TestBed.createComponent(ChatRoomNotificationSettingsComponent);
    comp = fixture.componentInstance;

    (comp as any).singleChatRoomService.chatRoom$.next(mockChatRoomEdge);

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
    expect(fixture.nativeElement.querySelector('m-toggle')).toBeTruthy();
  });

  it('should set notifications to muted when initing a room with muted notifications', fakeAsync(() => {
    (comp as any).notificationsMuted$.next(false);
    (comp as any).singleChatRoomService.chatRoom$.next({
      node: {
        chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.Muted,
      },
    });
    tick();
    expect((comp as any).notificationsMuted$.getValue()).toBe(true);
  }));

  it('should set notifications to not muted when initing a room with not muted notifications', fakeAsync(() => {
    (comp as any).notificationsMuted$.next(true);
    (comp as any).singleChatRoomService.chatRoom$.next({
      node: { chatRoomNotificationStatus: ChatRoomNotificationStatusEnum.All },
    });
    tick();
    expect((comp as any).notificationsMuted$.getValue()).toBe(false);
  }));

  describe('onMuteNotificationToggle', () => {
    it('should mute notificiation toggle', fakeAsync(() => {
      (comp as any).notificationsMuted$.next(false);
      (
        comp as any
      ).updateChatRoomNotificationSettingsGql.mutate.and.returnValue(
        of({
          data: { updateNotificationSettings: true },
        })
      );

      (comp as any).onMuteNotificationToggle(true);
      tick();

      expect((comp as any).notificationsMuted$.getValue()).toBe(true);
      expect(
        (comp as any).updateChatRoomNotificationSettingsGql.mutate
      ).toHaveBeenCalledWith(
        {
          roomGuid: mockChatRoomEdge.node.guid,
          notificationStatus: ChatRoomNotificationStatusEnum.Muted,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((comp as any).toaster.error).not.toHaveBeenCalled();
    }));

    it('should unmute notificiation toggle', fakeAsync(() => {
      (comp as any).notificationsMuted$.next(true);
      (
        comp as any
      ).updateChatRoomNotificationSettingsGql.mutate.and.returnValue(
        of({
          data: { updateNotificationSettings: true },
        })
      );

      (comp as any).onMuteNotificationToggle(false);
      tick();

      expect((comp as any).notificationsMuted$.getValue()).toBe(false);
      expect(
        (comp as any).updateChatRoomNotificationSettingsGql.mutate
      ).toHaveBeenCalledWith(
        {
          roomGuid: mockChatRoomEdge.node.guid,
          notificationStatus: ChatRoomNotificationStatusEnum.All,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((comp as any).toaster.error).not.toHaveBeenCalled();
    }));

    it('should handle errors when muting notificiation toggle', fakeAsync(() => {
      const error: Error = new Error('error');
      (comp as any).notificationsMuted$.next(false);
      (
        comp as any
      ).updateChatRoomNotificationSettingsGql.mutate.and.returnValue(
        of({
          errors: [error],
        })
      );

      (comp as any).onMuteNotificationToggle(true);
      tick();

      expect((comp as any).notificationsMuted$.getValue()).toBe(false);
      expect(
        (comp as any).updateChatRoomNotificationSettingsGql.mutate
      ).toHaveBeenCalledWith(
        {
          roomGuid: mockChatRoomEdge.node.guid,
          notificationStatus: ChatRoomNotificationStatusEnum.Muted,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((comp as any).toaster.error).toHaveBeenCalledWith(error);
    }));

    it('should handle falsy response when muting notificiation toggle', fakeAsync(() => {
      (comp as any).notificationsMuted$.next(false);
      (
        comp as any
      ).updateChatRoomNotificationSettingsGql.mutate.and.returnValue(
        of({
          data: { updateNotificationSettings: false },
        })
      );

      (comp as any).onMuteNotificationToggle(true);
      tick();

      expect((comp as any).notificationsMuted$.getValue()).toBe(false);
      expect(
        (comp as any).updateChatRoomNotificationSettingsGql.mutate
      ).toHaveBeenCalledWith(
        {
          roomGuid: mockChatRoomEdge.node.guid,
          notificationStatus: ChatRoomNotificationStatusEnum.Muted,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        new Error(DEFAULT_ERROR_MESSAGE)
      );
    }));
  });
});
