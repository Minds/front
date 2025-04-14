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
import { CreateChatRoomService } from '../../../chat/services/create-chat-room.service';
import { Router } from '@angular/router';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject, of } from 'rxjs';
import { MindsUser } from '../../../../interfaces/entities';
import userMock from '../../../../mocks/responses/user.mock';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { PermissionsEnum } from '../../../../../graphql/generated.engine';

describe('ChannelActionsMessageComponent', () => {
  let comp: ChannelActionsMessageComponent;
  let fixture: ComponentFixture<ChannelActionsMessageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ChannelActionsMessageComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['iconOnly', 'overlay'],
          outputs: ['onAction'],
          template: `<ng-container></ng-container>`,
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId', 'sizeFactor'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
      ],
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
          provide: CreateChatRoomService,
          useValue: MockService(CreateChatRoomService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: IS_TENANT_NETWORK, useValue: true },
        ChangeDetectorRef,
      ],
    });

    fixture = TestBed.createComponent(ChannelActionsMessageComponent);
    comp = fixture.componentInstance;
    spyOn(window, 'open');

    Object.defineProperty(comp, 'isTenantNetwork', {
      value: true,
      writable: true,
    });

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

  describe('shouldShow', () => {
    it('should determine button should show because not on tenant network and user has permission', () => {
      (comp as any).permissionIntentsService.shouldHide.and.returnValue(false);
      Object.defineProperty(comp, 'isTenantNetwork', {
        value: false,
        writable: true,
      });

      comp.ngOnInit();
      fixture.detectChanges();

      expect((comp as any).shouldShow).toBeTrue();
    });

    it('should determine button should show because on tenant network and chat experiment is active with permission', () => {
      (comp as any).permissionIntentsService.shouldHide.and.returnValue(false);
      Object.defineProperty(comp, 'isTenantNetwork', {
        value: true,
        writable: true,
      });

      comp.ngOnInit();

      expect((comp as any).shouldShow).toBeTrue();
    });

    it('should determine button should NOT show because not on tenant network, but the user has no permission', () => {
      (comp as any).permissionIntentsService.shouldHide.and.returnValue(true);
      Object.defineProperty(comp, 'isTenantNetwork', {
        value: false,
        writable: true,
      });

      comp.ngOnInit();

      expect((comp as any).shouldShow).toBeFalse();
    });
  });

  describe('internal chat requests', () => {
    it('should handle minds internal chat requests', fakeAsync(() => {
      const chatRoomId: string = '12345';
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(true);
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
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(true);
      (comp as any).createChatRoom.createChatRoom.and.returnValue(
        Promise.resolve(chatRoomId)
      );

      comp.message();
      tick();

      expect((comp as any).createChatRoom.createChatRoom).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should handle minds internal chat requests and not navigate when there is an error', fakeAsync(() => {
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(true);
      (comp as any).createChatRoom.createChatRoom.and.returnValue(
        Promise.reject(new Error('Chat room creation failed'))
      );

      comp.message();
      tick();

      expect((comp as any).createChatRoom.createChatRoom).toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));

    it('should NOT handle minds internal chat requests and not navigate when the user does not have permission', fakeAsync(() => {
      (comp as any).permissionIntentsService.checkAndHandleAction
        .withArgs(PermissionsEnum.CanCreateChatRoom)
        .and.returnValue(false);

      comp.message();
      tick();

      expect(
        (comp as any).createChatRoom.createChatRoom
      ).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
    }));
  });
});
