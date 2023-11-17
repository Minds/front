import { Injectable } from '@angular/core';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { ConfigsService } from './configs.service';
import { PermissionsEnum } from '../../../graphql/generated.engine';

export const VIDEO_PERMISSIONS_ERROR_MESSAGE =
  'Your user role does not allow uploading video.';

export const COMMENT_PERMISSIONS_ERROR_MESSAGE =
  'Your user role does not allow commenting.';

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
    configs: ConfigsService
  ) {
    if (configs.get('permissions')) {
      this.whitelist = Object.values(configs.get('permissions'));
    }
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
  private has(permission: PermissionsEnum): boolean {
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

  // Is the user allowed to assign permissions?
  public canAssignPermissions(): boolean {
    return this.has(PermissionsEnum.CanAssignPermissions);
  }
}
