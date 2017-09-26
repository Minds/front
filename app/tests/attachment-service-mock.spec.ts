// TODO actually implement these mocks when necessary for testing
import { EventEmitter } from '@angular/core';

export let attachmentServiceMock = new function () {
  this.load = jasmine.createSpy('load').and.stub();
  this.setContainer = jasmine.createSpy('setContainer').and.stub();
  this.getContainer = jasmine.createSpy('getContainer').and.stub();
  this.setAccessId = jasmine.createSpy('setAccessId').and.stub();
  this.setHidden = jasmine.createSpy('setHidden').and.stub();
  this.isHidden = jasmine.createSpy('isHidden').and.stub();
  this.setMature = jasmine.createSpy('setMature').and.stub();

  this.isMature = jasmine.createSpy('isMature').and.stub();
  this.toggleMature = jasmine.createSpy('toggleMature').and.stub();
  this.upload = jasmine.createSpy('upload').and.stub();
  this.remove = jasmine.createSpy('remove').and.stub();
  this.has = jasmine.createSpy('has').and.stub();

  this.hasFile = jasmine.createSpy('hasFile').and.stub();
  this.getUploadProgress = jasmine.createSpy('getUploadProgress').and.stub();
  this.getPreview = jasmine.createSpy('getPreview').and.stub();
  this.getMime = jasmine.createSpy('getMime').and.stub();
  this.isRich = jasmine.createSpy('isRich').and.stub();

  this.getMeta = jasmine.createSpy('getMeta').and.stub();
  this.exportMeta = jasmine.createSpy('exportMeta').and.stub();
  this.resetRich = jasmine.createSpy('resetRich').and.stub();
  this.preview = jasmine.createSpy('preview').and.stub();

  this.parseMaturity = jasmine.createSpy('parseMaturity').and.stub();
  this.isForcefullyShown = jasmine.createSpy('isForcefullyShown').and.stub();
  this.shouldBeBlurred = jasmine.createSpy('shouldBeBlurred').and.stub();
  this.checkFileType = jasmine.createSpy('checkFileType').and.stub();

  this.viewEmitter = new EventEmitter<any>();
};
