describe('testing discovery', () => {
  var subject;
  var result;


  browser.get('/discovery/suggested');

  beforeEach(function() {

  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });

  it('should have title', function(){
    browser.get('/discovery/suggested');
    subject = browser.getTitle();
    result  = 'Discovery | Minds';
  });

  it('suggested should show channels', function() {
    browser.get('/discovery/suggested');
    subject = element(by.css('.mdl-tabs__tab.is-active')).getText();
    result  = 'CHANNELS';
  });

  it('trending should show images', function() {
    browser.get('/discovery/trending');
    subject = element(by.css('.mdl-tabs__tab.is-active')).getText();
    result  = 'IMAGES';
  });

  it('featured should show channels', function() {
    browser.get('/discovery/featured');
    subject = element(by.css('.mdl-tabs__tab.is-active')).getText();
    result  = 'CHANNELS';
  });

  it('owner should show everything', function() {
    browser.get('/discovery/owner');
    subject = element.all(by.css('.mdl-tabs__tab.is-active')).count();
    result  = 4;
  });

});
