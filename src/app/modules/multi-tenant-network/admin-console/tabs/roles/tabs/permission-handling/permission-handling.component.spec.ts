import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  ExportedPermissionIntent,
  NetworkAdminConsoleRolesPermissionHandlingComponent,
} from './permission-handling.component';
import { SiteMembershipService } from '../../../../../../site-memberships/services/site-memberships.service';
import { MockService } from '../../../../../../../utils/mock';
import {
  GetPermissionIntentsGQL,
  PermissionIntent,
  PermissionIntentTypeEnum,
  PermissionsEnum,
  SetPermissionIntentGQL,
  SiteMembership,
} from '../../../../../../../../graphql/generated.engine';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { BehaviorSubject, of } from 'rxjs';
import { mockSiteMemberships } from '../../../../../../site-memberships/services/site-memberships.service.spec';

describe('NetworkAdminConsoleRolesPermissionHandlingComponent', () => {
  let comp: NetworkAdminConsoleRolesPermissionHandlingComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleRolesPermissionHandlingComponent>;
  let getPermissionIntentsGqlMock: jasmine.SpyObj<GetPermissionIntentsGQL>;
  const defaultPermissionIntents: PermissionIntent[] = [
    {
      permissionId: PermissionsEnum.CanCreatePost,
      intentType: PermissionIntentTypeEnum.Hide,
      membershipGuid: null,
    },
    {
      permissionId: PermissionsEnum.CanInteract,
      intentType: PermissionIntentTypeEnum.WarningMessage,
      membershipGuid: null,
    },
    {
      permissionId: PermissionsEnum.CanUploadVideo,
      intentType: PermissionIntentTypeEnum.WarningMessage,
      membershipGuid: '1654463882556608522',
    },
    {
      permissionId: PermissionsEnum.CanCreateChatRoom,
      intentType: PermissionIntentTypeEnum.Upgrade,
      membershipGuid: '1648335156483723269',
    },
    {
      permissionId: PermissionsEnum.CanComment,
      intentType: PermissionIntentTypeEnum.WarningMessage,
      membershipGuid: null,
    },
  ];

  beforeEach((done: DoneFn) => {
    getPermissionIntentsGqlMock = jasmine.createSpyObj<GetPermissionIntentsGQL>(
      ['fetch']
    );
    getPermissionIntentsGqlMock.fetch.and.returnValue(
      of({
        loading: false,
        networkStatus: 7,
        data: {
          permissionIntents: defaultPermissionIntents,
        },
      })
    );

    TestBed.configureTestingModule({
      imports: [NetworkAdminConsoleRolesPermissionHandlingComponent],
      providers: [
        {
          provide: SiteMembershipService,
          useValue: MockService(SiteMembershipService, {
            has: ['initialized$', 'siteMemberships$'],
            props: {
              initialized$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
              siteMemberships$: {
                get: () =>
                  new BehaviorSubject<SiteMembership[]>(mockSiteMemberships),
              },
            },
          }),
        },
        {
          provide: GetPermissionIntentsGQL,
          useValue: getPermissionIntentsGqlMock,
        },
        {
          provide: SetPermissionIntentGQL,
          useValue: jasmine.createSpyObj<SetPermissionIntentGQL>(['mutate']),
        },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleRolesPermissionHandlingComponent
    );
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
    expect((comp as any).siteMembershipService.fetch).toHaveBeenCalled();
    expect((comp as any).getPermissionIntentsGQL.fetch).toHaveBeenCalled();
  });

  describe('dataLoaded$', () => {
    it('should determine when data is loaded', (done: DoneFn) => {
      (comp as any).siteMembershipService.initialized$.next(true);
      (comp as any).permissionIntentsLoaded$.next(true);

      (comp as any).dataLoaded$.subscribe((dataLoaded: boolean) => {
        expect(dataLoaded).toBeTrue();
        done();
      });
    });

    it('should determine when data is not loaded because site membership data is missing', (done: DoneFn) => {
      (comp as any).siteMembershipService.initialized$.next(false);
      (comp as any).permissionIntentsLoaded$.next(true);

      (comp as any).dataLoaded$.subscribe((dataLoaded: boolean) => {
        expect(dataLoaded).toBeFalse();
        done();
      });
    });

    it('should determine when data is not loaded because permission intents data is missing', (done: DoneFn) => {
      (comp as any).siteMembershipService.initialized$.next(true);
      (comp as any).permissionIntentsLoaded$.next(false);

      (comp as any).dataLoaded$.subscribe((dataLoaded: boolean) => {
        expect(dataLoaded).toBeFalse();
        done();
      });
    });

    it('should determine when data is not loaded because both site membership and permission intents data are missing', (done: DoneFn) => {
      (comp as any).siteMembershipService.initialized$.next(false);
      (comp as any).permissionIntentsLoaded$.next(false);

      (comp as any).dataLoaded$.subscribe((dataLoaded: boolean) => {
        expect(dataLoaded).toBeFalse();
        done();
      });
    });
  });

  describe('onSelectorChange', () => {
    it('should set permission intent', fakeAsync(() => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1654463882556608522';

      const permissionIntent: PermissionIntent = {
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      };

      const event: any = {
        target: {
          value: JSON.stringify(permissionIntent),
        },
      } as any;

      (comp as any).setPermissionIntentGQL.mutate.and.returnValue(
        of({ data: { setPermissionIntent: true } })
      );
      (comp as any).onSelectorChange(event, permissionIntent);
      tick();

      expect((comp as any).setPermissionIntentGQL.mutate).toHaveBeenCalledWith({
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      });
      const resultIntents = [
        {
          permissionId: 'CAN_CREATE_POST',
          intentType: 'HIDE',
          membershipGuid: null,
        },
        {
          permissionId: 'CAN_INTERACT',
          intentType: 'WARNING_MESSAGE',
          membershipGuid: null,
        },
        {
          permissionId: 'CAN_UPLOAD_VIDEO',
          intentType: 'WARNING_MESSAGE',
          membershipGuid: '1654463882556608522',
        },
        {
          permissionId: 'CAN_CREATE_CHAT_ROOM',
          intentType: 'UPGRADE',
          membershipGuid: '1648335156483723269',
        },
        {
          permissionId: 'CAN_COMMENT',
          intentType: 'WARNING_MESSAGE',
          membershipGuid: null,
        },
      ];

      expect((comp as any).permissionIntents$.getValue()).toEqual(
        resultIntents
      );
      expect((comp as any).configs.set).toHaveBeenCalledWith(
        'permission_intents',
        resultIntents.map(
          (intent: any): ExportedPermissionIntent => ({
            permission_id: intent.permissionId,
            intent_type: intent.intentType,
            membership_guid: intent.membershipGuid,
          })
        )
      );
    }));

    it('should handle errors when setting permission intent', fakeAsync(() => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1654463882556608522';

      const permissionIntent: PermissionIntent = {
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      };

      const event: any = {
        target: {
          value: JSON.stringify(permissionIntent),
        },
      } as any;

      (comp as any).setPermissionIntentGQL.mutate.and.throwError(
        new Error('Error')
      );
      (comp as any).onSelectorChange(event, permissionIntent);
      tick();

      expect((comp as any).setPermissionIntentGQL.mutate).toHaveBeenCalledWith({
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      });
      expect((comp as any).configs.set).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'An unknown error occurred. Please try again later.'
      );
    }));

    it('should handle failure to save when setting permission intent', fakeAsync(() => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1654463882556608522';

      const permissionIntent: PermissionIntent = {
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      };

      const event: any = {
        target: {
          value: JSON.stringify(permissionIntent),
        },
      } as any;

      (comp as any).setPermissionIntentGQL.mutate.and.returnValue(
        of({ data: { setPermissionIntent: false } })
      );
      (comp as any).onSelectorChange(event, permissionIntent);
      tick();

      expect((comp as any).setPermissionIntentGQL.mutate).toHaveBeenCalledWith({
        permissionId: permissionId,
        intentType: permissionIntentType,
        membershipGuid: membershipGuid,
      });
      expect((comp as any).configs.set).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'An unknown error occurred. Please try again later.'
      );
    }));
  });
});
