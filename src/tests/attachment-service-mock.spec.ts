export let attachmentServiceMock = new (function() {
  this.container = null;
  this.accessId = null;
  this.hidden = false;

  this.mature = false;
  this.hasFile = false;

  this.progress = 0;

  this.preview = '';
  this.getMime = '';
  this.rich = false;
  this.meta = {};
  this.preview = '';
  this.blur = false;
  this.nsfw = [];

  this.load = jasmine.createSpy('load').and.stub();

  this.setContainer = jasmine
    .createSpy('setContainer')
    .and.callFake(container => {
      this.container = container;
    });
  this.getContainer = jasmine.createSpy('getContainer').and.callFake(() => {
    return this.container;
  });
  this.setAccessId = jasmine.createSpy('setAccessId').and.callFake(accessId => {
    this.accessId = accessId;
  });
  this.setHidden = jasmine.createSpy('setHidden').and.callFake(hidden => {
    this.hidden = hidden;
  });
  this.isHidden = jasmine.createSpy('isHidden').and.callFake(() => {
    return this.hidden;
  });
  this.setMature = jasmine.createSpy('setMature').and.callFake(mature => {
    this.mature = mature;
  });
  this.isMature = jasmine.createSpy('isMature').and.callFake(() => {
    return !!this.mature;
  });
  this.setNSFW = jasmine.createSpy('setNSFW').and.callFake(nsfw => {
    return nsfw;
  });
  this.toggleMature = jasmine.createSpy('toggleMature').and.callFake(() => {
    this.mature = !!this.mature ? 0 : 1;
  });
  this.upload = jasmine.createSpy('upload').and.stub();

  this.remove = jasmine.createSpy('remove').and.stub();

  this.has = jasmine.createSpy('has').and.callFake(() => {});

  this.hasFile = jasmine.createSpy('hasFile').and.callFake(() => {
    return this.hasFile;
  });
  this.getUploadProgress = jasmine
    .createSpy('getUploadProgress')
    .and.callFake(() => {
      return this.progress;
    });
  this.getPreview = jasmine.createSpy('getPreview').and.stub();

  this.getMime = jasmine.createSpy('getMime').and.stub();

  this.isRich = jasmine.createSpy('isRich').and.callFake(() => {
    return this.rich;
  });

  this.getMeta = jasmine.createSpy('getMeta').and.stub();

  this.exportMeta = jasmine.createSpy('exportMeta').and.returnValue({});

  this.resetRich = jasmine.createSpy('resetRich').and.stub();

  this.preview = jasmine.createSpy('preview').and.stub();

  this.parseMaturity = jasmine.createSpy('parseMaturity').and.stub();

  this.isForcefullyShown = jasmine.createSpy('isForcefullyShown').and.stub();

  this.shouldBeBlurred = jasmine
    .createSpy('shouldBeBlurred')
    .and.callFake(() => {
      return this.blur;
    });
  this.checkFileType = jasmine.createSpy('checkFileType').and.stub();
})();
