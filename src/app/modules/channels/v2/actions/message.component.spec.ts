import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChannelActionsMessageComponent } from './message.component';
import { ChannelsV2Service } from '../channels-v2.service';
import { MessengerConversationDockpanesService } from '../../../messenger/dockpanes/dockpanes.service';
import { MessengerConversationBuilderService } from '../../../messenger/dockpanes/conversation-builder.service';
import { ApiService } from '../../../../common/api/api.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ChangeDetectorRef } from '@angular/core';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ChatExperimentService } from '../../../experiments/sub-services/chat-experiment.service';
import { CreateChatRoomService } from '../../../chat/services/create-chat-room.service';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { MockService } from '../../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import userMock from '../../../../mocks/responses/user.mock';

describe('MyComponent', () => {
  let comp: ChannelActionsMessageComponent;
  let fixture: ComponentFixture<ChannelActionsMessageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [ChannelActionsMessageComponent],
      providers: [
        {
          provide: ChannelsV2Service,
          useValue: MockService(ChannelsV2Service, {
            has: ['channel$'],
            props: {
              channel$: {
                get: () => new BehaviorSubject<MindsUser>(userMock),
              },
            },
          }),
        },
        {
          provide: MessengerConversationDockpanesService,
          useValue: MockService(MessengerConversationDockpanesService),
        },
        {
          provide: MessengerConversationBuilderService,
          useValue: MockService(MessengerConversationBuilderService),
        },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ChatExperimentService,
          useValue: MockService(ChatExperimentService),
        },
        {
          provide: CreateChatRoomService,
          useValue: MockService(CreateChatRoomService),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: IS_TENANT_NETWORK, useValue: true },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(ChannelActionsMessageComponent);
    comp = fixture.componentInstance;
    spyOn(window, 'open');

    (comp as any).isChatExperimentActive = false;

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

  describe('internal chat requests', () => {
    it('should handle minds internal chat requests', fakeAsync(() => {
      const chatRoomId: string = '12345';
      (comp as any).isChatExperimentActive = true;
      (comp as any).createChatRoom.createChatRoom.and.returnValue(
        Promise.resolve(chatRoomId)
      );

      comp.message();
      tick();

      expect((comp as any).createChatRoom.createChatRoom).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        '/chat/rooms/' + chatRoomId
      );
    }));

    it('should handle minds internal chat requests and not navigate when no room id is returned', fakeAsync(() => {
      const chatRoomId: string = null;
      (comp as any).isChatExperimentActive = true;
      (comp as any).createChatRoom.createChatRoom.and.returnValue(
        Promise.resolve(chatRoomId)
      );

      comp.message();
      tick();

      expect((comp as any).createChatRoom.createChatRoom).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should handle minds internal chat requests and not navigate when there is an error', fakeAsync(() => {
      (comp as any).isChatExperimentActive = true;
      (comp as any).createChatRoom.createChatRoom.and.returnValue(
        Promise.reject(new Error('Chat room creation failed'))
      );

      comp.message();
      tick();

      expect((comp as any).createChatRoom.createChatRoom).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));
  });

  describe('matrix chat requests', () => {
    it('should handle minds matrix chat requests', fakeAsync(() => {
      (comp as any).isChatExperimentActive = false;
      (comp as any).api.put.and.returnValue(of({ room: { id: '12345' } }));
      (comp as any).configs.get
        .withArgs('matrix')
        .and.returnValue({ chat_url: 'https://example.minds.com' });

      comp.message();
      tick();

      expect((comp as any).api.put).toHaveBeenCalledWith(
        'api/v3/matrix/room/' + userMock.guid
      );
      expect(window.open).toHaveBeenCalledWith(
        'https://example.minds.com/#/room/12345',
        'chat'
      );
    }));
  });
});