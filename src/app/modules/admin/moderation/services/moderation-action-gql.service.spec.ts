import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ModerationActionGqlService } from './moderation-action-gql.service';
import {
  ModerationDeleteEntityGQL,
  ModerationSetUserBanStateGQL,
} from '../../../../../graphql/generated.engine';
import { MockService } from '../../../../utils/mock';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { of } from 'rxjs';

describe('ModerationActionGqlService', () => {
  let service: ModerationActionGqlService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ModerationActionGqlService,
        {
          provide: ModerationSetUserBanStateGQL,
          useValue: jasmine.createSpyObj<ModerationSetUserBanStateGQL>([
            'mutate',
          ]),
        },
        {
          provide: ModerationDeleteEntityGQL,
          useValue: jasmine.createSpyObj<ModerationDeleteEntityGQL>(['mutate']),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(ModerationActionGqlService);
    spyOn(console, 'error'); // mute errors.
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('setUserBanState', () => {
    it('should call to set user ban state to true', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const hasPermission: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).setUserBanStateGql.mutate.and.returnValue(
        of({ data: { setUserBanState: true } })
      );
      service.setUserBanState(userGuid, true);
      tick();

      expect((service as any).setUserBanStateGql.mutate).toHaveBeenCalledWith({
        subjectGuid: userGuid,
        banState: true,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'User successfully banned.'
      );
    }));

    it('should call to set user ban state to false', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const hasPermission: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).setUserBanStateGql.mutate.and.returnValue(
        of({ data: { setUserBanState: true } })
      );
      service.setUserBanState(userGuid, false);
      tick();

      expect((service as any).setUserBanStateGql.mutate).toHaveBeenCalledWith({
        subjectGuid: userGuid,
        banState: false,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'User successfully unbanned.'
      );
    }));

    it('should display an error if the user does not have permission', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const hasPermission: boolean = false;

      (service as any).permissions.has.and.returnValue(hasPermission);
      service.setUserBanState(userGuid, false);
      tick();

      expect((service as any).setUserBanStateGql.mutate).not.toHaveBeenCalled();
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'You do not have permission to set user ban state.'
      );
    }));

    it('should display an error if graphql does not return a success', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const hasPermission: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).setUserBanStateGql.mutate.and.returnValue(
        of({ data: { setUserBanState: false } })
      );

      service.setUserBanState(userGuid, false);
      tick();

      expect((service as any).setUserBanStateGql.mutate).toHaveBeenCalledWith({
        subjectGuid: userGuid,
        banState: false,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when updating this users ban state. Please try again later.'
      );
    }));

    it('should display an error if graphql reports an error', fakeAsync(() => {
      const userGuid: string = '1234567890123456';
      const hasPermission: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).setUserBanStateGql.mutate.and.returnValue(
        of({
          errors: [{ message: 'error' }],
        })
      );
      service.setUserBanState(userGuid, false);
      tick();

      expect((service as any).setUserBanStateGql.mutate).toHaveBeenCalledWith({
        subjectGuid: userGuid,
        banState: false,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error when updating this users ban state. Please try again later.'
      );
    }));
  });

  describe('deleteEntity', () => {
    it('should call to set delete entity', fakeAsync(() => {
      const entityUrn: string = 'urn:activity:123';
      const hasPermission: boolean = true;
      const responseSuccess: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).deleteEntityGql.mutate.and.returnValue(
        of({ data: { deleteEntity: responseSuccess } })
      );

      service.deleteEntity(entityUrn);
      tick();

      expect((service as any).deleteEntityGql.mutate).toHaveBeenCalledWith({
        subjectUrn: entityUrn,
      });
      expect((service as any).toaster.success).toHaveBeenCalledWith(
        'Successfully deleted.'
      );
    }));

    it('should display an error if the user does not have permission', fakeAsync(() => {
      const entityUrn: string = 'urn:activity:123';
      const hasPermission: boolean = false;

      (service as any).permissions.has.and.returnValue(hasPermission);

      service.deleteEntity(entityUrn);
      tick();

      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'You do not have permission to delete this entity.'
      );
    }));

    it('should display an error if graphql does not return a success', fakeAsync(() => {
      const entityUrn: string = 'urn:activity:123';
      const hasPermission: boolean = true;
      const responseSuccess: boolean = false;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).deleteEntityGql.mutate.and.returnValue(
        of({ data: { deleteEntity: responseSuccess } })
      );

      service.deleteEntity(entityUrn);
      tick();

      expect((service as any).deleteEntityGql.mutate).toHaveBeenCalledWith({
        subjectUrn: entityUrn,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error whilst deleting. Please try again later.'
      );
    }));

    it('should display an error if graphql reports an error', fakeAsync(() => {
      const entityUrn: string = 'urn:activity:123';
      const hasPermission: boolean = true;

      (service as any).permissions.has.and.returnValue(hasPermission);
      (service as any).deleteEntityGql.mutate.and.returnValue(
        of({ errors: [{ message: 'error' }] })
      );

      service.deleteEntity(entityUrn);
      tick();

      expect((service as any).deleteEntityGql.mutate).toHaveBeenCalledWith({
        subjectUrn: entityUrn,
      });
      expect((service as any).toaster.error).toHaveBeenCalledWith(
        'There was an error whilst deleting. Please try again later.'
      );
    }));
  });
});
