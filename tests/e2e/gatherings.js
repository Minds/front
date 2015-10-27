describe('testing gatherings', () => {
  var subject;
  var result;

  beforeEach(function() {
    browser.get('/messenger');
  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });

  it('should have title', function(){
    subject = browser.getTitle();
    result  = 'Messenger | Minds';
  });

  it('should have conversation search', function() {
    subject = element(by.id('gathering-search')).isPresent();
    result  = true;
  });

  it('should have conversation list', function() {
    subject = element(by.css('.minds-gatherings-conversation-list')).isPresent();
    result  = true;
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

    subject = password1.isPresent();
    result  = false;
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

    subject = password.isPresent();
    result  = false;
  });

});
