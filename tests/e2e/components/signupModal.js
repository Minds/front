var path = require('path');
import { Helpers } from '../helpers';

let h = new Helpers();

describe('testing signup modal', () => {

  beforeEach(() => {
    h.logout();
  });

  it('should not be visible immediatly', () => {
    browser.get('/protractor');
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  /*it('should not be visible after scroll', () => {
    browser.get('/protractor');

    browser.executeScript('window.scrollTo(200,0);').then(() => {
      expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(true);
    });
  });*/

  it('should not be visible on login page', () => {
    browser.get('/login');
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  it('should not be visible to loggedin users', () => {
    h.login();
    expect(element(by.css('m-modal-signup .m-modal-container')).isPresent()).toEqual(false);
  });

  /*it('should close on clicking the close button', () => {
    browser.get('/protractor');
    browser.executeScript('window.scrollTo(200,0);');
    element(by.css('m-modal-signup .mdl-card__menu > i')).click();
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  it('should close on clicking maybe later', () => {
    browser.get('/protractor');
    browser.executeScript('window.scrollTo(200,0);');
    element(by.css('m-modal-signup .m-modal-signup-skip')).click();
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  //it('should close on clicking the background', () => {
  //  browser.get('/');
  //  element(by.css('m-modal-signup m-modal > .m-modal-bg')).click();
  //  expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  //});

  it('should login redirect to reffer', () => {
    browser.get('/discovery/featured');
    browser.executeScript('window.scrollTo(200,0);');

    element.all(by.css('.mdl-card__supporting-text .mdl-button')).get(1).click();

    element.all(by.id('username')).get(0).sendKeys('protractor');
    element.all(by.id('password')).get(0).sendKeys('password');
    element.all(by.css('.mdl-button')).get(2).click();

    var passwordTextField = element.all(by.id('password')).get(0);
    var loginButton = element.all(by.css('.mdl-button')).get(2);

    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl +'/discovery/featured');
  })*/

});
