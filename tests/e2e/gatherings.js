describe('testing gatherings', () => {

  beforeEach(function() {
    browser.get('/messenger');
  });

  afterEach(function() {

  });

  it('should have title', function(){
    expect(browser.getTitle()).toEqual("Messenger | Minds");
  });

  it('should have conversation search', function() {
    expect(element(by.id('gathering-search')).isPresent()).toEqual(true);

  });

  it('should have conversation list', function() {
    expect(element(by.css('.minds-gatherings-conversation-list')).isPresent()).toEqual(true);
  });

  it('should configure chat', function() {
    var password1 = element(by.id('password1'));
    var password2 = element(by.id('password2'));
    var pass = 'pass123';
    password1.isPresent().then(function(result){
      if (result) {
        lpassword1.sendKeys(pass);
        password2.sendKeys(pass);
        element(by.css('.mdl-button--raised.mdl-button--colored')).click();
      }
    });

    expect(password1.isPresent()).toEqual(false);
  });

  it('should unlock chat', function() {
    var password = element(by.id('password'));
    var pass = 'pass123';
    password.isPresent().then(function(result){
      if (result) {
        password.sendKeys(pass);
        element(by.css('.mdl-button--raised.mdl-button--colored')).click();
      }
    });

    expect(password.isPresent()).toEqual(false);
  });

});
