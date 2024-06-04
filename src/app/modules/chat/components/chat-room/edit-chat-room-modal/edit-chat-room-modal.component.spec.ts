import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { EditChatRoomModalComponent } from '../edit-chat-room-modal/edit-chat-room-modal.component';
import { UpdateChatRoomNameService } from '../../../services/update-chat-room-name.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule as NgCommonModule } from '@angular/common';
import { mockChatRoomEdge } from '../../../../../mocks/chat.mock';

describe('EditChatRoomModalComponent', () => {
  let comp: EditChatRoomModalComponent;
  let fixture: ComponentFixture<EditChatRoomModalComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [EditChatRoomModalComponent, ReactiveFormsModule],
      providers: [
        {
          provide: UpdateChatRoomNameService,
          useValue: MockService(UpdateChatRoomNameService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).overrideComponent(EditChatRoomModalComponent, {
      set: {
        imports: [
          NgCommonModule,
          ReactiveFormsModule,
          MockComponent({
            selector: 'm-modalCloseButton',
            standalone: true,
          }),
          MockComponent({
            selector: 'm-formError',
            inputs: ['errors'],
            standalone: true,
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'size', 'solid', 'saving', 'disabled'],
            outputs: ['onAction'],
            template: `<ng-content></ng-content>`,
            standalone: true,
          }),
        ],
      },
    });

    fixture = TestBed.createComponent(EditChatRoomModalComponent);
    comp = fixture.componentInstance;

    spyOn(console, 'error'); // mute excpected errors.

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

  describe('onUpdateClick', () => {
    it('should handle successful update', fakeAsync(() => {
      const roomName: string = 'roomName';

      (comp as any).onCompleted = jasmine
        .createSpy('onCompleted')
        .and.returnValue(() => void 0);
      (comp as any).updateChatRoomNameService.update.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).chatRoomEdge = mockChatRoomEdge;
      (comp as any).formGroup.get('roomName').setValue(roomName);

      (comp as any).onUpdateClick();
      tick();

      expect(
        (comp as any).updateChatRoomNameService.update
      ).toHaveBeenCalledOnceWith(mockChatRoomEdge.node.guid, roomName);
      expect((comp as any).onCompleted).toHaveBeenCalled();
    }));

    it('should handle unsuccessful update', fakeAsync(() => {
      const roomName: string = 'roomName';
      const error: Error = new Error('error');

      (comp as any).onCompleted = jasmine
        .createSpy('onCompleted')
        .and.returnValue(() => void 0);
      (comp as any).updateChatRoomNameService.update.and.throwError(error);
      (comp as any).chatRoomEdge = mockChatRoomEdge;
      (comp as any).formGroup.get('roomName').setValue(roomName);

      (comp as any).onUpdateClick();
      tick();

      expect(
        (comp as any).updateChatRoomNameService.update
      ).toHaveBeenCalledOnceWith(mockChatRoomEdge.node.guid, roomName);
      expect((comp as any).onCompleted).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledOnceWith(error);
    }));
  });
});
