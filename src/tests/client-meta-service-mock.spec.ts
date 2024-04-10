export const clientMetaServiceMock = new (function () {
  this.source = null;
  this.timestamp = null;
  this.salt = null;
  this.medium = null;
  this.campaign = null;
  this.id = null;
  this.injector = null;

  this.inherit = jasmine.createSpy('inherit').and.callFake(() => this);
  this.getId = jasmine.createSpy('getId').and.callFake(() => this.id);
  this.setSource = jasmine
    .createSpy('setSource')
    .and.callFake((source) => this);
  this.getSource = jasmine
    .createSpy('getSource')
    .and.callFake(() => this.source);
  this.getTimestamp = jasmine
    .createSpy('getTimestamp')
    .and.callFake(() => this.timestamp);
  this.getSalt = jasmine.createSpy('getSalt').and.callFake(() => this.salt);
  this.buildDelta = jasmine.createSpy('buildDelta').and.callFake(() => this);
  this.setMedium = jasmine.createSpy('setMedium').and.callFake(() => this);
  this.getMedium = jasmine
    .createSpy('getMedium')
    .and.callFake(() => this.medium);
  this.setCampaign = jasmine.createSpy('setCampaign').and.callFake(() => this);
  this.getCampaign = jasmine
    .createSpy('getCampaign')
    .and.callFake(() => this.campaign);
  this.buildPageToken = jasmine
    .createSpy('buildPageToken')
    .and.callFake(() => this);
  this.build = jasmine.createSpy('build').and.callFake(() => ({}));
})();
