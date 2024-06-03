import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateChatRoomNameService } from './update-chat-room-name.service';
import { UpdateChatRoomNameGQL } from '../../../../graphql/generated.engine';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';
import { of } from 'rxjs';

describe('UpdateChatRoomNameService', () => {
  let service: UpdateChatRoomNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UpdateChatRoomNameService,
        {
          provide: UpdateChatRoomNameGQL,
          useValue: jasmine.createSpyObj<UpdateChatRoomNameGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(UpdateChatRoomNameService);

    spyOn(console, 'error'); // mute expected errors.
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('update', () => {
    it('should handle successful update', fakeAsync(() => {
      const roomGuid = '1234567890123456';
      const roomName = 'roomName';
      const response = {
        errors: [],
        data: {
          updateChatRoomName: true,
        },
      };
      (service as any).updateChatRoomNameGQL.mutate.and.returnValue(
        of(response)
      );

      (service as any).update(roomGuid, roomName);
      tick();

      expect(
        (service as any).updateChatRoomNameGQL.mutate
      ).toHaveBeenCalledOnceWith(
        {
          roomGuid,
          roomName,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((service as any).toaster.error).not.toHaveBeenCalled();
    }));

    it('should handle unsuccessful update', fakeAsync(() => {
      const roomGuid = '1234567890123456';
      const roomName = 'roomName';
      const response = {
        errors: [],
        data: {
          updateChatRoomName: false,
        },
      };
      (service as any).updateChatRoomNameGQL.mutate.and.returnValue(
        of(response)
      );

      (service as any).update(roomGuid, roomName);
      tick();

      expect(
        (service as any).updateChatRoomNameGQL.mutate
      ).toHaveBeenCalledOnceWith(
        {
          roomGuid,
          roomName,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        new Error('Failed to update chat room name')
      );
    }));

    it('should handle unsuccessful update with graphql errors', fakeAsync(() => {
      const roomGuid = '1234567890123456';
      const roomName = 'roomName';
      const error: Error = new Error('error');
      const response = {
        errors: [error],
      };
      (service as any).updateChatRoomNameGQL.mutate.and.returnValue(
        of(response)
      );

      (service as any).update(roomGuid, roomName);
      tick();

      expect(
        (service as any).updateChatRoomNameGQL.mutate
      ).toHaveBeenCalledOnceWith(
        {
          roomGuid,
          roomName,
        },
        {
          update: jasmine.any(Function),
        }
      );
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(error);
    }));
  });

  describe('handleUpdateSuccess', () => {
    it('should handle update success', () => {
      const cache = jasmine.createSpyObj('InMemoryCache', ['modify']);
      const result = {
        data: {
          updateChatRoomName: true,
        },
      };
      const options = {
        variables: {
          roomGuid: '1234567890123456',
        },
      };

      (service as any).handleUpdateSuccess(cache, result, options);

      expect(cache.modify).toHaveBeenCalledOnceWith({
        id: `ChatRoomNode:urn:chat:${options.variables.roomGuid}`,
        fields: { name: jasmine.any(Function) },
      });
    });
  });
});
