import { Helpers } from './helpers';
let h = new Helpers();

describe('testing the login', () => {

  var usernameTextField = element.all(by.id('username')).get(0);
  var passwordTextField = element.all(by.id('password')).get(0);
  var loginButton = element.all(by.css('.mdl-button')).get(2);
  var forgotPasswordButton = element(by.css('.m-reset-password-link'));

  beforeEach(function() {
    h.logout();
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

  it('should throw an error on a bad login', function(){
    usernameTextField.sendKeys('protractor');
    passwordTextField.sendKeys('wrong pass');
    loginButton.click();
    //expect(browser.getTitle()).toEqual("Newsfeed | Minds");
  });

});
