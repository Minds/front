var path = require('path');
import { Helpers } from '../helpers';

let h = new Helpers();

describe('testing signup modal', () => {

  beforeEach(() => {
    h.logout();
  });

  it('should be visible', () => {
    browser.get('/');
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(true);
  });

  it('should not be visible on login page', () => {
    browser.get('/login');
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  it('should not be visible to loggedin users', () => {
    h.login();
    expect(element(by.css('m-modal-signup .m-modal-container')).isPresent()).toEqual(false);
  });

  it('should close on clicking the close button', () => {
    browser.get('/');
    element(by.css('m-modal-signup .mdl-card__menu > i')).click();
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  it('should close on clicking maybe later', () => {
    browser.get('/');
    element(by.css('m-modal-signup .m-modal-signup-skip')).click();
    expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  });

  //it('should close on clicking the background', () => {
  //  browser.get('/');
  //  element(by.css('m-modal-signup m-modal > .m-modal-bg')).click();
  //  expect(element(by.css('m-modal-signup .m-modal-container')).isDisplayed()).toEqual(false);
  //});

});
