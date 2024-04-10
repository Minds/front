export let recentServiceMock = new (function () {
  this.storage = {
    data: [],
    get: (key) => {
      return this.storage.data[key];
    },
    set: (key, value) => {
      this.storage.data[key] = value;
    },
  };

  // static reference
  this._ = jasmine.createSpy('_').and.stub();

  // public methods
  this.store = jasmine.createSpy('store').and.stub();
  this.fetch = jasmine.createSpy('fetch').and.stub();
  this.splice = jasmine.createSpy('splice').and.stub();

  this.storeSuggestion = jasmine.createSpy('storeSuggestion').and.stub();
  this.fetchSuggestions = jasmine.createSpy('fetchSuggestions').and.stub();
  this.clearSuggestions = jasmine.createSpy('clearSuggestions').and.stub();

  // private methods
  this.read = jasmine.createSpy('read').and.stub();
  this.write = jasmine.createSpy('write').and.stub();
})();
