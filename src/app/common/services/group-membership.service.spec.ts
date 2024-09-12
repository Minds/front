import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApiService } from '../api/api.service';
import { GroupMembershipService } from './group-membership.service';
import { MockService } from '../../utils/mock';
import { ToasterService } from './toaster.service';
import { groupMock } from '../../mocks/responses/group.mock';
import { of } from 'rxjs';
import { GroupAccessType } from '../../modules/groups/v2/group.types';
import { Router } from '@angular/router';

describe('GroupMembershipService', () => {
  let service: GroupMembershipService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupMembershipService,
        {
          provide: ApiService,
          useValue: MockService(ApiService),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: Router,
          useValue: MockService(Router),
        },
      ],
    });

    service = TestBed.inject(GroupMembershipService);

    service.group$.next({
      ...groupMock,
      membership: GroupAccessType.PUBLIC,
    });
    (service as any).isPublic$.next(true);
    (service as any).isAwaiting$.next(false);
    (service as any).isMember$.next(false);
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  describe('join', () => {
    it('should join an open group', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(true);
      expect((service as any).isAwaiting$.getValue()).toBe(false);
    }));

    it('should join a closed group', fakeAsync(() => {
      (service as any).isAwaiting$.next(false);
      (service as any).isMember$.next(false);

      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PRIVATE,
      });
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isAwaiting$.getValue()).toBe(true);
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Your request to join this group has been sent.'
      );
    }));

    it('should join a closed group when already invited', fakeAsync(() => {
      (service as any).isAwaiting$.next(false);
      (service as any).isMember$.next(false);

      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PRIVATE,
      });
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
          invite_accepted: true,
        })
      );

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(true);
      expect((service as any).isAwaiting$.getValue()).toBe(false);
      expect((service as any).toaster.success).not.toHaveBeenCalled();
    }));

    it('should handle an error when joining a group if done returned as false', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(false);
    }));

    it('should handle an error when joining a group if an exception is thrown', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(false);
    }));
  });

  describe('acceptRequest', () => {
    it('should join an open group', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.acceptRequest(targetUserGuid);
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(true);
      expect((service as any).isAwaiting$.getValue()).toBe(false);
    }));

    it('should accept a request to join a closed group', fakeAsync(() => {
      (service as any).isAwaiting$.next(false);
      (service as any).isMember$.next(false);

      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PRIVATE,
      });
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.acceptRequest(targetUserGuid);
      tick();

      expect((service as any).api.put).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isAwaiting$.getValue()).toBe(true);
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Your request to join this group has been sent.'
      );
    }));

    it('should handle an error when accepting a request to join a group if done returned as false', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.acceptRequest(targetUserGuid);
      tick();

      expect((service as any).api.put).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(false);
    }));

    it('should handle an error when accepting a request to join a group if an exception is thrown', fakeAsync(() => {
      (service as any).isMember$.next(false);
      (service as any).isAwaiting$.next(false);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.put.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.join({ targetUserGuid });
      tick();

      expect((service as any).api.put).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(false);
    }));
  });

  describe('leave', () => {
    it('should leave a group', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.leave(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
    }));

    it('should handle an error when leaving a group if done returned as false', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.leave(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(true);
    }));

    it('should handle an error when leaving a group if an exception is thrown', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.leave(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(true);
    }));
  });

  describe('rejectRequest', () => {
    it('should reject a request to leave a group', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.rejectRequest(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
    }));

    it('should handle an error when rejecting a request to leave a group if done returned as false', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.rejectRequest(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(true);
    }));

    it('should handle an error when rejecting a request to leave a group if an exception is thrown', fakeAsync(() => {
      (service as any).isMember$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });
      const errorMessage: string = 'Testing triggered an expected error.';
      const targetUserGuid: string = '1234567890123451';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/${targetUserGuid}`;
      (service as any).api.delete.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.rejectRequest(targetUserGuid);
      tick();

      expect((service as any).api.delete).toHaveBeenCalledOnceWith(endpoint);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
      expect((service as any).isMember$.getValue()).toBe(true);
    }));
  });

  describe('acceptInvitation', () => {
    it('should accept an invitation to a group', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isMember$.next(false);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/accept`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.acceptInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(true);
      expect((service as any).isInvited$.getValue()).toBe(false);
    }));

    it('should handle an error when accepting a group invitation if done returned as false', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isMember$.next(false);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/accept`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.acceptInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isInvited$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));

    it('should handle an error when accepting a group invitation if an exception is thrown', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isMember$.next(false);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/accept`;
      (service as any).api.post.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.acceptInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isInvited$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));
  });

  describe('declineInvitation', () => {
    it('should decline an invitation to a group', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/decline`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.declineInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isInvited$.getValue()).toBe(false);
    }));

    it('should handle an error when declining a group invitation if done returned as false', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/decline`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.declineInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isInvited$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));

    it('should handle an error when leaving a group if an exception is thrown', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isInvited$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/invitations/${groupMock.guid}/decline`;
      (service as any).api.post.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.declineInvitation();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isMember$.getValue()).toBe(false);
      expect((service as any).isInvited$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));
  });

  describe('cancelRequest', () => {
    it('should cancel a request to join a group', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isAwaiting$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/cancel`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: true,
        })
      );

      service.cancelRequest();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isAwaiting$.getValue()).toBe(false);
    }));

    it('should handle an error when cancelling a request to join a group', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isAwaiting$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/cancel`;
      (service as any).api.post.withArgs(endpoint).and.returnValue(
        of({
          status: 'success',
          done: false,
          message: errorMessage,
        })
      );

      service.cancelRequest();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isAwaiting$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));

    it('should handle an error when leaving a group if an exception is thrown', fakeAsync(() => {
      (service as any).isPublic$.next(true);
      (service as any).isAwaiting$.next(true);
      service.group$.next({
        ...groupMock,
        membership: GroupAccessType.PUBLIC,
      });

      const errorMessage: string = 'Testing triggered an expected error.';
      const endpoint: string = `api/v1/groups/membership/${groupMock.guid}/cancel`;
      (service as any).api.post.withArgs(endpoint).and.throwError({
        error: { message: errorMessage },
      });

      service.cancelRequest();
      tick();

      expect((service as any).api.post).toHaveBeenCalledWith(endpoint);
      expect((service as any).isAwaiting$.getValue()).toBe(true);
      expect((service as any).toaster.error).toHaveBeenCalledOnceWith(
        errorMessage
      );
    }));
  });
});
