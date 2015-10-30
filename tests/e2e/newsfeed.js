describe('testing newsfeed', () => {

  browser.get('/newsfeed');

  beforeEach(function() {

  });

  afterEach(function() {
  });

  it('should have a title', function(){
    expect(browser.getTitle()).toEqual("Newsfeed | Minds");
  });

  it('should have poster', function() {
    expect(element(by.css('minds-newsfeed-poster')).isPresent()).toEqual(true);
  });

  it('should have activity list', function(){
    expect(element(by.css('minds-activity.mdl-card')).isPresent()).toEqual(true);
  });

  it('should have user card', function(){
    expect(element(by.css('minds-card-user')).isPresent()).toEqual(true);
  });

  it('should have analytics', function(){
    expect(element(by.css('minds-analytics-impressions')).isPresent()).toEqual(true);
  });

  it('should post', function(){
    var post = 'test post';
    element(by.id('message')).sendKeys(post);
    element(by.css('.mdl-card__actions .mdl-button')).click();
    var postContainer = element.all(by.css('minds-activity .mdl-card__supporting-text.message')).get(0);
    expect(postContainer.getText()).toEqual(post);
  });

});
