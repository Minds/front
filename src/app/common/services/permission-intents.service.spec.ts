import { TestBed } from '@angular/core/testing';
import { PermissionIntentsService } from './permission-intents.service';
import { ConfigsService } from './configs.service';
import { MockService } from '../../utils/mock';
import { PermissionsService } from './permissions.service';
import { ToasterService } from './toaster.service';
import { SingleSiteMembershipModalService } from '../../modules/site-memberships/services/single-site-membership-modal.service';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { SITE_NAME } from '../injection-tokens/common-injection-tokens';
import {
  PermissionIntentTypeEnum,
  PermissionsEnum,
} from '../../../graphql/generated.engine';
import { ExportedPermissionIntent } from '../../modules/multi-tenant-network/admin-console/tabs/roles/tabs/permission-handling/permission-handling.component';
import { PlusUpgradeModalService } from '../../modules/wire/v2/plus-upgrade-modal.service';

describe('PermissionIntentsService', () => {
  let service: PermissionIntentsService;
  const siteName: string = 'ExampleNet';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PermissionIntentsService,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: SingleSiteMembershipModalService,
          useValue: MockService(SingleSiteMembershipModalService),
        },
        {
          provide: PlusUpgradeModalService,
          useValue: MockService(PlusUpgradeModalService),
        },
        { provide: IS_TENANT_NETWORK, useValue: true },
        { provide: SITE_NAME, useValue: siteName },
      ],
    });

    service = TestBed.inject(PermissionIntentsService);
    Object.defineProperty(service, 'isTenantNetwork', {
      value: true,
      writable: true,
    });
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('checkAndHandleAction', () => {
    it('should return true if user has permission', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(true);

      expect(service.checkAndHandleAction(permissionId)).toBeTrue();
    });

    it('should return false if user no has permission and intent is to hide', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Hide;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);

      expect(service.checkAndHandleAction(permissionId)).toBeFalse();
      expect((service as any).toasterService.warn).toHaveBeenCalled();
    });

    it('should return false if user no has permission and intent is to show warning message', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.WarningMessage;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);

      expect(service.checkAndHandleAction(permissionId)).toBeFalse();
      expect((service as any).toasterService.warn).toHaveBeenCalled();
    });

    it('should return false if user no has permission and intent is to show membership modal', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1234567890123456';
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: membershipGuid,
        },
      ];

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);

      expect(service.checkAndHandleAction(permissionId)).toBeFalse();
      expect((service as any).toasterService.warn).not.toHaveBeenCalled();
      expect(
        (service as any).singleSiteMembershipModal.open
      ).toHaveBeenCalledWith({
        title: 'Upgrade to unlock',
        subtitle:
          "You don't have access to this feature. Please upgrade to one of the below memberships to unlock.",
        closeCtaText: `Go back to ${siteName}`,
        upgradeMode: true,
        membershipGuid: membershipGuid,
      });
    });
  });

  describe('shouldHide', () => {
    it('should return false if user has permission', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(true);

      expect(service.shouldHide(permissionId)).toBeFalse();
    });

    it('should return false if user has no permission but intent is not to hide', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.WarningMessage;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldHide(permissionId)).toBeFalse();
    });

    it('should return true if user has permission and intent is to hide', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Hide;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldHide(permissionId)).toBeTrue();
    });
  });

  describe('shouldShowWarningMessage', () => {
    it('should return false if user has permission', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(true);

      expect(service.shouldShowWarningMessage(permissionId)).toBeFalse();
    });

    it('should return false if user has no permission but intent is not to show warning message', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Hide;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldShowWarningMessage(permissionId)).toBeFalse();
    });

    it('should return true if user has permission and intent is to show warning message', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.WarningMessage;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldShowWarningMessage(permissionId)).toBeTrue();
    });
  });

  describe('shouldShowMembershipModal', () => {
    it('should return false if not on a tenant network', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      Object.defineProperty(service, 'isTenantNetwork', {
        value: false,
        writable: true,
      });
      expect(service.shouldShowMembershipModal(permissionId)).toBeFalse();
    });

    it('should return false if user has permission', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      Object.defineProperty(service, 'isTenantNetwork', {
        value: true,
        writable: true,
      });

      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(true);

      expect(service.shouldShowMembershipModal(permissionId)).toBeFalse();
    });

    it('should return false if user has no permission but intent is not to show membership modal', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.WarningMessage;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: null,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldShowMembershipModal(permissionId)).toBeFalse();
    });

    it('should return true if user has permission and intent is to show membership modal', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1234567890123456';
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: PermissionsEnum.CanComment,
          intent_type: permissionIntentType,
          membership_guid: membershipGuid,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);
      (service as any).permissionsService.has
        .withArgs(permissionId)
        .and.returnValue(false);

      expect(service.shouldShowMembershipModal(permissionId)).toBeTrue();
    });
  });

  describe('showWarningToastMessage', () => {
    it('should show a warning toast message for can create post', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanCreatePost;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to create a post"
      );
    });

    it('should show a warning toast message for can interact', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanInteract;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to vote or remind"
      );
    });

    it('should show a warning toast message for can upload video', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanUploadVideo;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to upload videos"
      );
    });

    it('should show a warning toast message for can create chat room', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanCreateChatRoom;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to create a chat room"
      );
    });

    it('should show a warning toast message for can comment', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to comment"
      );
    });

    it('should show a default warning toast message for undefined permission', () => {
      const permissionId: PermissionsEnum = undefined;
      service.showWarningToastMessage(permissionId);
      expect((service as any).toasterService.warn).toHaveBeenCalledWith(
        "You don't have permission to perform this action"
      );
    });
  });

  describe('showMembershipModal', () => {
    it('should show membership modal', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = '1234567890123456';
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: permissionId,
          intent_type: permissionIntentType,
          membership_guid: membershipGuid,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);

      service.showMembershipModal(permissionId);

      expect((service as any).toasterService.warn).not.toHaveBeenCalled();
      expect(
        (service as any).singleSiteMembershipModal.open
      ).toHaveBeenCalledWith({
        title: 'Upgrade to unlock',
        subtitle:
          "You don't have access to this feature. Please upgrade to one of the below memberships to unlock.",
        closeCtaText: `Go back to ${siteName}`,
        upgradeMode: true,
        membershipGuid: membershipGuid,
      });
    });

    it('should show toast instead of membership modal when intent is to upgrade but there is no membership guid', () => {
      const permissionId: PermissionsEnum = PermissionsEnum.CanComment;
      const permissionIntentType: PermissionIntentTypeEnum =
        PermissionIntentTypeEnum.Upgrade;
      const membershipGuid: string = null;
      const exportedPermissionIntents: ExportedPermissionIntent[] = [
        {
          permission_id: permissionId,
          intent_type: permissionIntentType,
          membership_guid: membershipGuid,
        },
      ];

      (service as any).configs.get
        .withArgs('permission_intents')
        .and.returnValue(exportedPermissionIntents);

      service.showMembershipModal(permissionId);

      expect((service as any).toasterService.warn).toHaveBeenCalled();
      expect(
        (service as any).singleSiteMembershipModal.open
      ).not.toHaveBeenCalled();
    });
  });
});
