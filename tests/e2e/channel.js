var path = require('path');
import { Helpers } from './helpers';

let h = new Helpers();

describe('testing channels', () => {

  beforeEach(() => {
    h.login();
    browser.get('/protractor');
    browser.wait(() => {
      return browser.getTitle().then(title => {return title == 'protractor | Minds'});
    }, 2000);
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual("protractor | Minds");
  });

  it('should have toggle button', () => {
    expect(element(by.css('minds-button-edit')).isPresent()).toEqual(true);
  });

  it('should enable edit mode on toggle button', () => {
    element.all(by.css('minds-button-edit')).get(0).click();
    expect(element(by.css('.minds-channel-bio .minds-editable-container')).isPresent()).toEqual(true);
  });

  it('should save bio on finished editing', () => {
    var bio = "automated test bio";

    //enable edit mode
    element(by.cssContainingText('minds-button-edit > button', 'edit')).click();

    element(by.css('.minds-channel-bio .minds-editable-container textarea'))
      .clear()
      .sendKeys(bio);

    element(by.cssContainingText('minds-button-edit > button', 'done')).click();

    expect(element(by.css('.minds-channel-bio .mdl-card__supporting-text')).getText()).toEqual(bio);

    //reload page
    browser.get('/protractor');
    browser.wait(() => {
      return browser.getTitle().then(title => {return title == 'protractor | Minds'});
    }, 2000);

    expect(element(by.css('.minds-channel-bio .mdl-card__supporting-text')).getText()).toEqual(bio);

  });

  it('should grow the bio box on new lines', () => {
    element(by.cssContainingText('minds-button-edit > button', 'edit')).click();

    var height = 0;
    element(by.css('.minds-channel-bio')).getSize().then((size) => { height = size.height; });

    browser.driver.sleep(300);

    element(by.css('.minds-channel-bio .minds-editable-container textarea'))
      .clear()
      .sendKeys("\n\n\n\n");

    element(by.css('.minds-channel-bio')).getSize().then((size) => {
      expect(size.height).toBeGreaterThan(height);
    });
  });

});
