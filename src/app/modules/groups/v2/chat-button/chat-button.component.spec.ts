import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { GroupChatButton } from './chat-button.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Router } from '@angular/router';
import { GroupChatRoomService } from '../services/group-chat-rooms.service';
import { mockChatRoomEdge } from '../../../../mocks/chat.mock';

describe('GroupChatButton', () => {
  let comp: GroupChatButton;
  let fixture: ComponentFixture<GroupChatButton>;
  const mockGroupGuid: string = '1234567890123456';

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        GroupChatButton,
        MockComponent({
          selector: 'm-button',
          inputs: ['title', 'i18n-title', 'overlay', 'iconOnly', 'disabled'],
          outputs: ['onAction'],
          template: `<ng-content></ng-content>`,
        }),
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId', 'sizeFactor'],
        }),
      ],
      providers: [
        {
          provide: GroupChatRoomService,
          useValue: MockService(GroupChatRoomService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: Router, useValue: MockService(Router) },
      ],
    });

    spyOn(console, 'error'); // mute errors.

    fixture = TestBed.createComponent(GroupChatButton);
    comp = fixture.componentInstance;
    (comp as any).groupGuid = mockGroupGuid;

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

  describe('handleClick', () => {
    it('should handle click', fakeAsync(() => {
      (comp as any).groupChatRoomService.createGroupChatRoom.and.returnValue(
        Promise.resolve(mockChatRoomEdge)
      );

      (comp as any).handleClick();
      tick();

      expect(
        (comp as any).groupChatRoomService.createGroupChatRoom
      ).toHaveBeenCalledOnceWith(mockGroupGuid);
      expect((comp as any).toasterService.error).not.toHaveBeenCalled();
      expect((comp as any).router.navigateByUrl).toHaveBeenCalledWith(
        `/chat/rooms/${mockChatRoomEdge.node.guid}`
      );
    }));

    it('should no room guid when creating on click', fakeAsync(() => {
      (comp as any).groupChatRoomService.createGroupChatRoom.and.returnValue(
        Promise.resolve(null)
      );

      (comp as any).handleClick();
      tick();

      expect(
        (comp as any).groupChatRoomService.createGroupChatRoom
      ).toHaveBeenCalledOnceWith(mockGroupGuid);
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        new Error('An error occurred, please try again later.')
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
      expect((comp as any).actionInProgress$.getValue()).toBeFalse();
    }));

    it('should handle errors when creating on click', fakeAsync(() => {
      const mockError: Error = new Error('errorMessage');
      (comp as any).groupChatRoomService.createGroupChatRoom.and.throwError(
        mockError
      );

      (comp as any).handleClick();
      tick();

      expect(
        (comp as any).groupChatRoomService.createGroupChatRoom
      ).toHaveBeenCalledOnceWith(mockGroupGuid);
      expect((comp as any).toasterService.error).toHaveBeenCalledOnceWith(
        mockError
      );
      expect((comp as any).router.navigateByUrl).not.toHaveBeenCalled();
      expect((comp as any).actionInProgress$.getValue()).toBeFalse();
    }));
  });
});
