import { Permission } from '../app/common/services/permissions.service';

export const permissionsServiceMock = new (function() {
  this.whitelist = [];

  this.isActive = jasmine.createSpy('isActive').and.callFake(() => false);

  this.has = jasmine.createSpy('has').and.callFake((permission: Permission) => {
    if (!this.isActive()) {
      return true;
    }
    return this.whitelist.includes(permission);
  });

  this.canPost = jasmine
    .createSpy('canPost')
    .and.callFake(() => this.has(Permission.CanCreatePost));
  this.canComment = jasmine
    .createSpy('canComment')
    .and.callFake(() => this.has(Permission.CanComment));
  this.canUploadVideo = jasmine
    .createSpy('canUploadVideo')
    .and.callFake(() => this.has(Permission.CanUploadVideo));
  this.canCreateGroup = jasmine
    .createSpy('canCreateGroup')
    .and.callFake(() => this.has(Permission.CanCreateGroup));
  this.canInteract = jasmine
    .createSpy('canCreateGroup')
    .and.callFake(() => this.has(Permission.CanInteract));
})();
