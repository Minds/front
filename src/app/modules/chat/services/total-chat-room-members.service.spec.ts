import { TestBed } from '@angular/core/testing';
import { TotalChatRoomMembersService } from './total-chat-room-members.service';
import { GetTotalChatRoomMembersGQL } from '../../../../graphql/generated.engine';
import { of } from 'rxjs';

describe('TotalChatRoomMembersService', () => {
  let service: TotalChatRoomMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TotalChatRoomMembersService,
        {
          provide: GetTotalChatRoomMembersGQL,
          useValue: jasmine.createSpyObj<GetTotalChatRoomMembersGQL>(['fetch']),
        },
      ],
    });

    service = TestBed.inject(TotalChatRoomMembersService);

    spyOn(console, 'error'); // suppress console errors.
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('membersCount$', () => {
    it('should get total members count', (done: DoneFn) => {
      const roomGuid: string = '1234567890';
      (service as any).roomGuid$.next(roomGuid);
      (service as any).getTotalChatRoomMembersGQL.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              totalMembers: 10,
            },
          },
        })
      );

      service.membersCount$.subscribe((count: number) => {
        expect(count).toEqual(10);
        done();
      });
    });

    it('should handle errors when getting total members count', (done: DoneFn) => {
      const roomGuid: string = '1234567890';
      (service as any).roomGuid$.next(roomGuid);
      (service as any).getTotalChatRoomMembersGQL.fetch.and.returnValue(
        of({
          data: {
            chatRoom: {
              totalMembers: null,
            },
          },
        })
      );

      service.membersCount$.subscribe((count: number) => {
        expect(count).toEqual(0);
        done();
      });
    });
  });
});
