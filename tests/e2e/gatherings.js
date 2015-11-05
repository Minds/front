import { Helpers } from './helpers';

let h = new Helpers();

describe('testing gatherings', () => {

  beforeAll((done) => {
    h.login();
    browser.get('/messenger?dry-run=true').then(() => {
      done();
    });
    browser.executeScript("window.Minds.user.chat = false;")
  })

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

    browser.executeScript("window.localStorage.clear()");
    browser.get('/messenger?dry-run=true');

    //progress is hidden
    //expect(element(by.css('.m-messenger-inProgress')).isDisplayed()).toEqual(false);

    var password1 = element(by.id('password1'));
    var password2 = element(by.id('password2'));
    var pass = 'password';

    password1.sendKeys(pass);
    password2.sendKeys(pass);
    element(by.css('.mdl-button--raised.mdl-button--colored')).click();
    //progress shows on click
    //expect(element(by.css('.m-messenger-inProgress')).isDisplayed()).toEqual(true);
    browser.wait(() => {
      return element(by.css('.gathering-footer-links > a')).isDisplayed();
    });

    expect(element(by.css('.gathering-footer-links > a')).isDisplayed()).toEqual(true);
    expect(element(by.css('.m-messenger-inProgress')).isPresent()).toEqual(false);
  });

  it('should unlock chat', function() {
    browser.executeScript("window.localStorage.clear()");
    browser.get('/messenger');
    var password = element(by.id('password'));
    var pass = 'password';

    password.sendKeys(pass);
    element(by.css('.mdl-button--raised.mdl-button--colored')).click();
    //expect(element(by.css('.m-messenger-inProgress')).isDisplayed()).toEqual(true);

    browser.wait(() => {
      return element(by.css('.gathering-footer-links > a')).isDisplayed();
    });

    expect(element(by.css('.gathering-footer-links > a')).isDisplayed()).toEqual(true);
    //expect(element(by.css('.m-messenger-inProgress')).isPresent()).toEqual(false);

    //expect(password.isPresent()).toEqual(false);
  });

  it('should not unlock chat on an incorrect password', function() {
    browser.executeScript("window.localStorage.clear()");
    browser.get('/messenger');

    var password = element(by.id('password'));
    var pass = 'incorrect';

    password.sendKeys(pass);
    element(by.css('.mdl-button--raised.mdl-button--colored')).click();
    //expect(element(by.css('.m-messenger-inProgress')).isDisplayed()).toEqual(true);

    browser.wait(() => {
      return element(by.css('.m-messenger-inProgress')).isDisplayed().then(displayed => { return !displayed });
    });

    expect(element(by.css('.gathering-footer-links > a')).isDisplayed()).toEqual(false);
    expect(element(by.css('.m-messenger-inProgress')).isDisplayed()).toEqual(false);
    expect(password.isDisplayed()).toEqual(true);

  });


  it('should not allow access to messenger if logged out, and redirect to login', () => {
    h.logout();
    browser.get('/messenger');
    browser.wait(() => {
      return browser.getCurrentUrl().then((url) => (url == browser.baseUrl + 'login'));
    })

  });

  it('should not be already loggedin following a logout', () => {
    //loginto chat
    h.login();
    browser.get('/messenger');
    element(by.id('password')).sendKeys('password');
    element(by.css('.mdl-button--raised.mdl-button--colored')).click();
    //now logout and back in again
    h.logout();

    //check the localStorage was deleted
    expect(browser.executeScript("return window.localStorage.getItem('private-key')")).toEqual(null);

    h.login();
    browser.get('/messenger');
    expect(element(by.css('.gathering-footer-links > a')).isDisplayed()).toEqual(false);
  });

});
