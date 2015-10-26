describe('testing the login', () => {
  var subject;
  var result;
  var usernameTextField = element.all(by.id('username')).get(1);
  var passwordTextField = element.all(by.id('password')).get(1);
  var loginButton = element.all(by.css('.mdl-button')).get(3);
  var forgotPasswordButton = element(by.css('.minds-reset-password-link'));

  browser.get('/login');

  beforeEach(function() {

  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });


  it('should have a title', function(){
    subject = browser.getTitle();
    result  = 'Login | Minds';
  });

  it('should have username', function() {
    subject = usernameTextField.isPresent();
    result  = true;
  });

  it('should have password', function(){
    subject = passwordTextField.isPresent();
    result  = true;
  });

  it('should have forgot password', function(){
    subject = forgotPasswordButton.isPresent();
    result  = true;
  });

  it('should have login button', function(){
    subject = loginButton.isPresent();
    result  = true;
  });

  it('should login', function(){
    usernameTextField.sendKeys('mindstestuser');
    passwordTextField.sendKeys('pass123');
    loginButton.click();
    subject = browser.getTitle();
    result  = 'Newsfeed | Minds';
  });

});
