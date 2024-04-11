// TODO actually implement these mocks when necessary for testing

export let translationServiceMock = new (function () {
  this.getLanguages = jasmine.createSpy('getLanguages').and.stub();
  this.getUserDefaultLanguage = jasmine
    .createSpy('getUserDefaultLanguage')
    .and.stub();
  this.purgeLanguagesCache = jasmine
    .createSpy('purgeLanguagesCache')
    .and.stub();
  this.getLanguageName = jasmine.createSpy('getLanguageName').and.stub();

  this.isTranslatable = jasmine.createSpy('isTranslatable').and.stub();
  this.translate = jasmine.createSpy('translate').and.stub();
})();
