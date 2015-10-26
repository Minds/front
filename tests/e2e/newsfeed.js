describe('testing newsfeed', () => {
  var subject;
  var result;

  
  browser.get('/newsfeed');
  if (browser.getTitle() == "Login | Minds"){
    element.all(by.id('username')).get(1).sendKeys('mindstestuser');
    element.all(by.id('password')).get(1).sendKeys('pass123');
    element.all(by.css('.mdl-button')).get(3).click();
  }

  beforeEach(function() {

  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });

  it('should have a title', function(){
    subject = browser.getTitle();
    result  = 'Newsfeed | Minds';
  });

  it('should have poster', function() {
    subject = element(by.css('minds-newsfeed-poster')).isPresent();
    result  = true;
  });

  it('should have activity list', function(){
    subject = element(by.css('minds-activity.mdl-card')).isPresent();
    result  = true;
  });

  it('should have user card', function(){
    subject = element(by.css('minds-card-user')).isPresent();
    result  = true;
  });

  it('should have analytics', function(){
    subject = element(by.css('minds-analytics-impressions')).isPresent();
    result  = true;
  });

  it('should post', function(){
    result = 'test post';
    element(by.id('message')).sendKeys(result);
    element(by.css('.mdl-card__actions .mdl-button')).click();
    var postContainer = element.all(by.css('minds-activity .mdl-card__supporting-text.message')).get(0);
    subject = postContainer.getText();
  });

});
