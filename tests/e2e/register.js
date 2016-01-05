import { Helpers } from './helpers';
let h = new Helpers();

describe('testing the login', () => {

  var usernameTextField = element.all(by.id('username')).get(1);
  var emailTextField = element(by.id('email'));
  var passwordTextField = element.all(by.id('password')).get(1);
  var password2TextField = element(by.id('password2'));

  beforeEach(function() {
    h.logout();
    browser.get('/login');
  });

  it('should have title ', function(){
    expect(browser.getTitle()).toEqual("Login | Minds");
  });

  it('should warn if username not entered', function() {
    expect(element(by.css('minds-register .m-error-box')).isDisplayed()).toEqual(false);
    element(by.css('.m-register-btn')).click();
    browser.sleep(1000);
    expect(element(by.css('minds-register .m-error-box')).isDisplayed()).toEqual(true);
  });

  it('should create a new register', function(){
    var username = 'test_' + Date.now();
    usernameTextField.sendKeys(username);
    emailTextField.sendKeys('test@minds.com');
    passwordTextField.sendKeys('password');
    password2TextField.sendKeys('password');
    element(by.css('.m-register-btn')).click();

    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + username + '?editToggle=true');

    browser.get('/settings');
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'settings');
  });

});
