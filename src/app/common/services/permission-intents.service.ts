import { Inject, Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import {
  PermissionIntent,
  PermissionIntentTypeEnum,
  PermissionsEnum,
} from '../../../graphql/generated.engine';
import { PermissionsService } from './permissions.service';
import { ToasterService } from './toaster.service';
import { IS_TENANT_NETWORK } from '../injection-tokens/tenant-injection-tokens';
import { ExportedPermissionIntent } from '../../modules/multi-tenant-network/admin-console/tabs/roles/tabs/permission-handling/permission-handling.component';
import { SingleSiteMembershipModalService } from '../../modules/site-memberships/services/single-site-membership-modal.service';
import { SITE_NAME } from '../injection-tokens/common-injection-tokens';
import { PlusUpgradeModalService } from '../../modules/wire/v2/plus-upgrade-modal.service';

/**
 * Service to handle permission intents. This service is used to check whether
 * a user has permission to perform an action / view something, and provide utilities
 * to handle by actioning the resulting permission intents if they do not have permission.
 */
@Injectable({ providedIn: 'root' })
export class PermissionIntentsService {
  constructor(
    private configs: ConfigsService,
    private permissionsService: PermissionsService,
    private toasterService: ToasterService,
    private singleSiteMembershipModal: SingleSiteMembershipModalService,
    private plusUpgradeModalService: PlusUpgradeModalService,
    @Inject(IS_TENANT_NETWORK) private readonly isTenantNetwork: boolean,
    @Inject(SITE_NAME) private readonly siteName: string
  ) {}

  /**
   * Check whether the user has permission to perform an action,
   * and handle the action if appropriate.
   * @param { PermissionEnum } permissionId - The permission to check.
   * @returns { boolean } - Whether the user has permission to perform the action.
   */
  public checkAndHandleAction(permissionId: PermissionsEnum): boolean {
    if (this.permissionsService.has(permissionId)) {
      return true;
    }

    // Hide intents should not get this far. It should be handled seperately as it isn't an action.
    // In the event is hasn't been, show a toast as a fallback as access should be prevented.
    if (
      this.shouldShowWarningMessage(permissionId) ||
      this.shouldHide(permissionId)
    ) {
      this.showWarningToastMessage(permissionId);
      return false;
    }

    if (this.shouldShowMembershipModal(permissionId)) {
      this.showMembershipModal(permissionId);
      return false;
    }

    return false;
  }

  /**
   * Check whether the user has no permission interact with something,
   * and the intent is to hide it.
   * @param { PermissionEnum } permissionId - The permission to check.
   * @returns { boolean } - Whether the user has permission to view the item.
   */
  public shouldHide(permissionId: PermissionsEnum): boolean {
    return (
      !this.permissionsService.has(permissionId) &&
      this.getPermissionIntent(permissionId)?.intentType ===
        PermissionIntentTypeEnum.Hide
    );
  }

  /**
   * Check whether a the user has no permission to interact with something,
   * and the intent is to show a warning message.
   * @param { PermissionEnum } permissionId - The permission to check.
   * @returns { boolean } - Whether a warning message should be shown.
   */
  public shouldShowWarningMessage(permissionId: PermissionsEnum): boolean {
    return (
      !this.permissionsService.has(permissionId) &&
      this.getPermissionIntent(permissionId)?.intentType ===
        PermissionIntentTypeEnum.WarningMessage
    );
  }

  /**
   * Check whether a the user has no permission to interact with something,
   * and the intent is to show a membership modal.
   * @param { PermissionEnum } permissionId - The permission to check.
   * @returns { boolean } - Whether a membership modal should be shown.
   */
  public shouldShowMembershipModal(permissionId: PermissionsEnum): boolean {
    // Site memberships modal is currently only available in tenant networks.
    if (!this.isTenantNetwork) {
      return false;
    }
    return (
      !this.permissionsService.has(permissionId) &&
      this.getPermissionIntent(permissionId)?.intentType ===
        PermissionIntentTypeEnum.Upgrade
    );
  }

  /**
   * Show a warning toast message for a given permission.
   * @param { PermissionEnum } permissionId - The permission to show the warning message for.
   * @returns { void }
   */
  public showWarningToastMessage(permissionId: PermissionsEnum): void {
    switch (permissionId) {
      case PermissionsEnum.CanCreatePost:
        this.toasterService.warn("You don't have permission to create a post");
        break;
      case PermissionsEnum.CanInteract:
        this.toasterService.warn("You don't have permission to vote or remind");
        break;
      case PermissionsEnum.CanUploadVideo:
        if (this.isTenantNetwork) {
          this.toasterService.warn(
            "You don't have permission to upload videos"
          );
        } else {
          this.plusUpgradeModalService.open({
            onPurchaseComplete(result) {
              window.location.reload();
            },
          });
        }
        break;
      case PermissionsEnum.CanCreateChatRoom:
        this.toasterService.warn(
          "You don't have permission to create a chat room"
        );
        break;
      case PermissionsEnum.CanComment:
        this.toasterService.warn("You don't have permission to comment");
        break;
      default:
        this.toasterService.warn(
          "You don't have permission to perform this action"
        );
    }
  }

  /**
   * Show the membership modal appropriate to the permission intent.
   * @param { PermissionEnum } permissionId - The permission to show the membership modal for.
   * @returns { void }
   */
  public showMembershipModal(permissionId: PermissionsEnum): void {
    const paymentIntent: PermissionIntent =
      this.getPermissionIntent(permissionId);

    if (!paymentIntent?.membershipGuid) {
      // fallback to showing a warning message.
      this.showWarningToastMessage(permissionId);
      console.warn('No membership guid found in permission intent');
      return;
    }

    this.singleSiteMembershipModal.open({
      title: 'Upgrade to unlock',
      subtitle:
        "You don't have access to this feature. Please upgrade to one of the below memberships to unlock.",
      closeCtaText: `Go back to ${this.siteName}`,
      upgradeMode: true,
      membershipGuid: paymentIntent.membershipGuid,
    });
  }

  /**
   * Get the permission intent for a given permission.
   * @param { PermissionEnum } permissionId - The permission to get the intent for.
   * @returns { PermissionIntent } - The permission intent.
   */
  private getPermissionIntent(permissionId: PermissionsEnum): PermissionIntent {
    return (
      this.configs
        .get<ExportedPermissionIntent[]>('permission_intents')
        ?.filter((intent: ExportedPermissionIntent): boolean => {
          return intent['permission_id'] === permissionId;
        })
        .map(
          (intent: ExportedPermissionIntent): PermissionIntent => ({
            permissionId: intent['permission_id'],
            intentType: intent['intent_type'],
            membershipGuid: intent['membership_guid'],
          })
        )?.[0] ?? null
    );
  }
}
