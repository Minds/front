describe('testing discovery', () => {

  browser.get('/discovery/suggested');

  beforeEach(function() {

  });

  afterEach(function() {
  });

  it('should have title', function(){
    browser.get('/discovery/suggested');
    expect(browser.getTitle()).toEqual("Discovery | Minds");
  });

  it('suggested should show channels', function() {
    browser.get('/discovery/suggested');
    expect(element(by.css('.mdl-tabs__tab.is-active')).getText()).toEqual("CHANNELS");
  });

  it('trending should show images', function() {
    browser.get('/discovery/trending');
    expect(element(by.css('.mdl-tabs__tab.is-active')).getText()).toEqual("IMAGES");
  });

  it('featured should show channels', function() {
    browser.get('/discovery/featured');
    expect(element(by.css('.mdl-tabs__tab.is-active')).getText()).toEqual("CHANNELS");
  });

  it('owner should show everything', function() {
    browser.get('/discovery/owner');
    expect(element.all(by.css('.mdl-tabs__tab.is-active')).count()).toEqual(4);
  });

});
