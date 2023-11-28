import { PermissionsEnum } from '../graphql/generated.engine';

export const permissionsServiceMock = new (function() {
  this.whitelist = [];

  this.isActive = jasmine.createSpy('isActive').and.callFake(() => false);

  this.has = jasmine
    .createSpy('has')
    .and.callFake((permission: PermissionsEnum) => {
      if (!this.isActive()) {
        return true;
      }
      return this.whitelist.includes(permission);
    });

  this.canPost = jasmine
    .createSpy('canPost')
    .and.callFake(() => this.has(PermissionsEnum.CanCreatePost));
  this.canComment = jasmine
    .createSpy('canComment')
    .and.callFake(() => this.has(PermissionsEnum.CanComment));
  this.canUploadVideo = jasmine
    .createSpy('canUploadVideo')
    .and.callFake(() => this.has(PermissionsEnum.CanUploadVideo));
  this.canCreateGroup = jasmine
    .createSpy('canCreateGroup')
    .and.callFake(() => this.has(PermissionsEnum.CanCreateGroup));
  this.canInteract = jasmine
    .createSpy('canInteract')
    .and.callFake(() => this.has(PermissionsEnum.CanInteract));
  this.canAssignPermissions = jasmine
    .createSpy('canAssignPermissions')
    .and.callFake(() => this.has(PermissionsEnum.CanAssignPermissions));
})();
