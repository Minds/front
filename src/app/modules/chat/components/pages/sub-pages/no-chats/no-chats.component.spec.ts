import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NoChatsSubPageComponent } from './no-chats.component';
import { MockComponent, MockService } from '../../../../../../utils/mock';
import { StartChatModalService } from '../../../start-chat-modal/start-chat-modal.service';
import { PermissionsService } from '../../../../../../common/services/permissions.service';
import { ChatRoomsListService } from '../../../../services/chat-rooms-list.service';
import { ToasterService } from '../../../../../../common/services/toaster.service';

describe('MyComponent', () => {
  let comp: NoChatsSubPageComponent;
  let fixture: ComponentFixture<NoChatsSubPageComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [NoChatsSubPageComponent],
      providers: [
        {
          provide: StartChatModalService,
          useValue: MockService(StartChatModalService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: ChatRoomsListService,
          useValue: MockService(ChatRoomsListService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).overrideComponent(NoChatsSubPageComponent, {
      set: {
        imports: [
          MockComponent({
            selector: 'm-chat__actionCard',
            inputs: ['headerText', 'descriptionText', 'ctaText'],
            outputs: ['actionButtonClick'],
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(NoChatsSubPageComponent);
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

  it('should handle start new chat click and refetch on create when user has permission', fakeAsync(() => {
    (comp as any).startChatModal.open.and.returnValue(Promise.resolve(true));
    (comp as any).permissionsService.canCreateChatRoom.and.returnValue(true);

    (comp as any).onStartNewChatClick();
    tick();

    expect((comp as any).startChatModal.open).toHaveBeenCalledWith(true);
    expect((comp as any).toaster.warn).not.toHaveBeenCalled();
    expect((comp as any).chatRoomsListService.refetch).toHaveBeenCalled();
  }));

  it("should handle start new chat click and NOT refetch on create when user has permission but didn't create a user", fakeAsync(() => {
    (comp as any).startChatModal.open.and.returnValue(Promise.resolve(false));
    (comp as any).permissionsService.canCreateChatRoom.and.returnValue(true);

    (comp as any).onStartNewChatClick();
    tick();

    expect((comp as any).startChatModal.open).toHaveBeenCalledWith(true);
    expect((comp as any).toaster.warn).not.toHaveBeenCalled();
    expect((comp as any).chatRoomsListService.refetch).not.toHaveBeenCalled();
  }));

  it('should NOT handle start new chat click if a user does not have permission', fakeAsync(() => {
    (comp as any).permissionsService.canCreateChatRoom.and.returnValue(false);

    (comp as any).onStartNewChatClick();
    tick();

    expect((comp as any).toaster.warn).toHaveBeenCalledOnceWith(
      "You don't have permission to create a chat room"
    );
    expect((comp as any).chatRoomsListService.refetch).not.toHaveBeenCalled();
    expect((comp as any).startChatModal.open).not.toHaveBeenCalled();
  }));
});
