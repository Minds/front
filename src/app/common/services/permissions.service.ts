import { Injectable } from '@angular/core';
import { ExperimentsService } from '../../modules/experiments/experiments.service';
import { ConfigsService } from './configs.service';

export enum Permission {
  CanCreatePost = 'CAN_CREATE_POST',
  CanComment = 'CAN_COMMENT',
  CanUploadVideo = 'CAN_UPLOAD_VIDEO',
  CanCreateGroup = 'CAN_CREATE_GROUP',
  CanAssignPermissions = 'CAN_ASSIGN_PERMISSIONS',
  CanInteract = 'CAN_INTERACT',
}

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
  private has(permission: Permission): boolean {
    // Don't implement restrictions if the experiment isn't enabled
    if (!this.isActive()) {
      return true;
    }

    return this.whitelist.includes(permission);
  }

  // Is the user allowed to create posts?
  public canCreatePost(): boolean {
    return this.has(Permission.CanCreatePost);
  }

  // Is the user allowed to comment?
  public canComment(): boolean {
    return this.has(Permission.CanComment);
  }

  // Is the user allowed to upload video?
  public canUploadVideo(): boolean {
    return this.has(Permission.CanUploadVideo);
  }

  // Is the user allowed to create a group?
  public canCreateGroup(): boolean {
    return this.has(Permission.CanCreateGroup);
  }

  // Is the user allowed to vote and remind?
  public canInteract(): boolean {
    return this.has(Permission.CanInteract);
  }

  // Is the user allowed to assign permissions?
  public canAssignPermissions(): boolean {
    return this.has(Permission.CanAssignPermissions);
  }
}
