var path = require('path');
import { Helpers } from '../helpers';

let h = new Helpers();

describe('testing sidebar toggle', () => {

  beforeEach(() => {
    browser.driver.manage().window().setSize(320, 600);
    browser.executeScript("window.localStorage.setItem('hideSignupModal', true);");
  });

  afterEach(() => {
    browser.executeScript("window.localStorage.removeItem('hideSignupModal');");
  });

  it('should always be visible on a large screen', () => {
    browser.driver.manage().window().setSize(1200, 800);
    browser.wait(() => {
      return element(by.css('minds-sidebar')).isDisplayed();
    },1000);
  });

  it('should be closed by default on smaller screens', () => {
    browser.wait(() => {
      return element(by.css('minds-sidebar')).isDisplayed().then(displayed => { return !displayed });
    },1000);
  });

  it('should open on click', () => {
    browser.get('/');
    element(by.css('.minds-menu-button')).click();
    browser.wait(() => {
      return element(by.css('minds-sidebar')).isDisplayed();
    },1000); //give a max of one second to appear
  });

  it('should close on clicking anywhere', () => {
    browser.get('/');
    element(by.css('minds-body')).click();
    browser.wait(() => {
      return element(by.css('minds-sidebar')).isDisplayed().then(displayed => { return !displayed });
    },1000);
  });

  it('should close on clicking on toggle button', () => {
    browser.get('/');
    element(by.css('.minds-menu-button')).click();
    browser.sleep(600); //wait for our next click
    element(by.css('.minds-menu-button')).click();

    browser.wait(() => {
      return element(by.css('minds-sidebar')).isDisplayed().then(displayed => { return !displayed });
    },1000);

  })

});
