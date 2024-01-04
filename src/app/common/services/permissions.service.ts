import { Injectable } from '@angular/core';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { ConfigsService } from './configs.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';

export const VIDEO_PERMISSIONS_ERROR_MESSAGE =
  'Your user role does not allow uploading video.';

export const COMMENT_PERMISSIONS_ERROR_MESSAGE =
  'Your user role does not allow commenting.';

export const INTERACTION_PERMISSIONS_ERROR_MESSAGE =
  'Your user role does not allow interactions on posts.';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  /**
   * User has permission to use
   * these permissions-restricted features
   */
  private whitelist: string[] = [];

  constructor(
    private experimentsService: ExperimentsService,
    private configs: ConfigsService
  ) {
    this.initFromConfigs();
  }

  /**
   * Loads permissions from configs
   */
  public initFromConfigs(): void {
    if (this.configs.get('permissions')) {
      this.whitelist = Object.values(this.configs.get('permissions'));
    }
  }

  /**
   * Sets the permissions that a user has (used for rehydration from login/register)
   * @param permissions
   */
  public setWhitelist(permissions: string[]): void {
    this.whitelist = Object.values(permissions);
  }

  /**
   * True if the `front-6121-rbac-permissions` experiment is enabled in growthbook
   */
  private isActive(): boolean {
    return this.experimentsService.hasVariation('front-6121-rbac-permissions');
  }

  /**
   * @param permission
   * @returns whether the user has permission
   */
  public has(permission: PermissionsEnum): boolean {
    // Don't implement restrictions if the experiment isn't enabled
    if (!this.isActive()) {
      return true;
    }

    return this.whitelist.includes(permission);
  }

  // Is the user allowed to create posts?
  public canCreatePost(): boolean {
    return this.has(PermissionsEnum.CanCreatePost);
  }

  // Is the user allowed to comment?
  public canComment(): boolean {
    return this.has(PermissionsEnum.CanComment);
  }

  // Is the user allowed to upload video?
  public canUploadVideo(): boolean {
    return this.has(PermissionsEnum.CanUploadVideo);
  }

  // Is the user allowed to create a group?
  public canCreateGroup(): boolean {
    return this.has(PermissionsEnum.CanCreateGroup);
  }

  // Is the user allowed to vote and remind?
  public canInteract(): boolean {
    return this.has(PermissionsEnum.CanInteract);
  }

  // Is the user allowed to assign permissions?
  public canAssignPermissions(): boolean {
    return this.has(PermissionsEnum.CanAssignPermissions);
  }

  /**
   * Can the user use RSS sync?
   * @returns { boolean } whether the user can use RSS sync
   */
  public canUseRssSync(): boolean {
    return this.has(PermissionsEnum.CanUseRssSync);
  }
}
