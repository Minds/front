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
import { BehaviorSubject } from 'rxjs';
import { ChatRoomEdge } from '../../../../../../../graphql/generated.engine';

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
      node: { areChatRoomNotificationsMuted: true },
    });
    tick();
    expect((comp as any).notificationsMuted$.getValue()).toBe(true);
  }));

  it('should set notifications to not muted when initing a room with not muted notifications', fakeAsync(() => {
    (comp as any).notificationsMuted$.next(true);
    (comp as any).singleChatRoomService.chatRoom$.next({
      node: { areChatRoomNotificationsMuted: false },
    });
    tick();
    expect((comp as any).notificationsMuted$.getValue()).toBe(false);
  }));
});
