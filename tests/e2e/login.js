describe('testing the login', () => {
  var usernameTextField = element.all(by.id('username')).get(1);
  var passwordTextField = element.all(by.id('password')).get(1);
  var loginButton = element.all(by.css('.mdl-button')).get(3);
  var forgotPasswordButton = element(by.css('.minds-reset-password-link'));

  beforeEach(function() {
    browser.get('/login');
  });

  afterEach(function() {
  });

  it('should have a title', function(){
    expect(browser.getTitle()).toEqual("Login | Minds");
  });

  it('should have username', function() {
    expect(usernameTextField.isPresent()).toEqual(true);
  });

  it('should have password', function(){
    expect(passwordTextField.isPresent()).toEqual(true);
  });

  it('should have forgot password', function(){
    expect(forgotPasswordButton.isPresent()).toEqual(true);
  });

  it('should have login button', function(){
    expect(loginButton.isPresent()).toEqual(true);
  });

  it('should login', function(){
    usernameTextField.sendKeys('mindstestuser');
    passwordTextField.sendKeys('pass123');
    loginButton.click();
    expect(browser.getTitle()).toEqual("Newsfeed | Minds");
  });

});
