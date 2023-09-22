import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GetGiftCardByCodeGQL } from '../../../../../graphql/generated.engine';
import { GroupInviteService } from './invite.service';
import { ApiService } from '../../../../common/api/api.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Session } from '../../../../services/session';
import { groupMock } from '../../../../mocks/responses/group.mock';
import userMock from '../../../../mocks/responses/user.mock';
import { of } from 'rxjs';

describe('GroupInviteService', () => {
  let service: GroupInviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupInviteService,
        {
          provide: ApiService,
          useValue: jasmine.createSpyObj<ApiService>(['put']),
        },
        {
          provide: ToasterService,
          useValue: jasmine.createSpyObj<ToasterService>(['success', 'error']),
        },
        {
          provide: Session,
          useValue: jasmine.createSpyObj<Session>(['getLoggedInUser']),
        },
      ],
    });

    service = TestBed.inject(GroupInviteService);

    (service as any).api.put.calls.reset();
    (service as any).toaster.success.calls.reset();
    (service as any).toaster.error.calls.reset();
    (service as any).session.getLoggedInUser.calls.reset();
    (service as any).session.getLoggedInUser.and.returnValue(userMock);

    service.setGroup(groupMock);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('invite', () => {
    it('should invite', fakeAsync(() => {
      (service as any).api.put.and.returnValue(
        of({ status: 'success', done: true })
      );

      service.invite(userMock);
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(
        `api/v1/groups/invitations/${groupMock.guid}`,
        {
          guid: userMock.guid,
        }
      );
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        `@${userMock.name} has been invited to join`
      );
    }));

    it('should show an error toast on error when inviting', fakeAsync(() => {
      const errorMessage: string = 'errorMessage';
      (service as any).api.put.and.returnValue(
        of({
          status: 'success',
          done: false,
          error: errorMessage,
        })
      );

      service.invite(userMock);
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(
        `api/v1/groups/invitations/${groupMock.guid}`,
        {
          guid: userMock.guid,
        }
      );
      expect((service as any).toaster.error).toHaveBeenCalledWith(errorMessage);
    }));
  });
});
