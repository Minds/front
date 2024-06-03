import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditChatRoomModalService } from './edit-chat-room-modal.service';
import { Injector } from '@angular/core';
import { ModalService } from '../../../../../services/ux/modal.service';
import { MockService } from '../../../../../utils/mock';
import { mockChatRoomEdge } from '../../../../../mocks/chat.mock';

describe('EditChatRoomModalService', () => {
  let service: EditChatRoomModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditChatRoomModalService,
        Injector,
        { provide: ModalService, useValue: MockService(ModalService) },
      ],
    });
    service = TestBed.inject(EditChatRoomModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open and handle onCompleted callback', fakeAsync(() => {
    const modalRefMock = {
      close: jasmine.createSpy('close'),
      result: true,
    };
    (service as any).modalService.present.and.returnValue(modalRefMock);

    service.open(mockChatRoomEdge);
    tick();

    expect((service as any).modalService.present).toHaveBeenCalledOnceWith(
      jasmine.anything(),
      {
        injector: (service as any).injector,
        lazyModule: jasmine.anything(),
        size: 'md',
        data: {
          chatRoomEdge: mockChatRoomEdge,
          onCompleted: jasmine.any(Function),
        },
      }
    );

    const onCompleted = (service as any).modalService.present.calls.mostRecent()
      .args[1].data.onCompleted;
    onCompleted();
    tick();

    expect(modalRefMock.close).toHaveBeenCalledOnceWith(true);
  }));
});
