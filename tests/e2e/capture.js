var path = require('path');
import { Helpers } from './helpers';

let h = new Helpers();

describe('testing uploader', () => {

  beforeEach(() => {
    h.login();
    browser.get('/capture');
  });

  it('should go login if not logged in', () => {
    h.logout();
    browser.get('/capture');
    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'login');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual("Capture | Minds");
  });

  it('should upload a file', () => {
    var fileToUpload = 'res/logo.png',
      absolutePath = path.resolve(__dirname, fileToUpload);

    element(by.id('file')).sendKeys(absolutePath);

    browser.wait(() => {
      return element(by.css('.mdl-progress.complete')).isPresent();
    });
  });

  it('should prompt to select an album', () => {
    element(by.css('.m-capture-save-to-album-button')).click();
    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.getText()).toEqual("You must select an album first");
    alertDialog.accept();
  });

  it('should have an album called "My Album"', () => {
    browser.wait(() => {
      return element(by.css('.m-albums-selector .mdl-progress')).isDisplayed().then((displayed) => { return !displayed });
    });

    expect(element(by.cssContainingText('.m-album', 'My Album')).isPresent()).toEqual(true);
  });

  it('should save to "My Album"', () => {
    var fileToUpload = 'res/logo.png',
      absolutePath = path.resolve(__dirname, fileToUpload);

    element(by.id('file')).sendKeys(absolutePath);

    browser.wait(() => {
      return element(by.css('.m-albums-selector .mdl-progress')).isDisplayed().then((displayed) => { return !displayed });
    });

    element(by.cssContainingText('.m-album','My Album')).click();

    browser.wait(() => {
      return element(by.css('.mdl-progress.complete')).isPresent();
    });

    element(by.css('.m-capture-save-to-album-button')).click();
    browser.sleep(2000);
    expect(browser.getCurrentUrl()).toContain('archive/view/');
  });

  it('should allow us to change the tit;e', () => {
    var fileToUpload = 'res/logo.png',
      absolutePath = path.resolve(__dirname, fileToUpload);

    element(by.id('file')).sendKeys(absolutePath);

    browser.wait(() => {
      return element(by.css('.m-album')).isPresent();
    });

    element(by.cssContainingText('.m-album','My Album')).click();

    browser.wait(() => {
      return element(by.css('.mdl-progress.complete')).isPresent();
    });

    element(by.css('.m-capture-edit-container input')).clear().sendKeys('Testing saving title');

    element(by.css('.m-capture-save-to-album-button')).click();
    browser.sleep(1000);

    element.all(by.css('minds-archive-grid > a')).get(0).click();
    browser.sleep(1000);
    expect(element(by.css('h1')).getText()).toContain('Testing saving title');

  });


  it('should allow us to change the license', () => {
    var fileToUpload = 'res/logo.png',
      absolutePath = path.resolve(__dirname, fileToUpload);

    element(by.id('file')).sendKeys(absolutePath);

    browser.wait(() => {
      return element(by.css('.m-album')).isPresent();
    });

    element(by.cssContainingText('.m-album','My Album')).click();

    browser.wait(() => {
      return element(by.css('.mdl-progress.complete')).isPresent();
    });

    element(by.cssContainingText('.m-capture-edit-container select option', 'Attribution CC BY')).click();

    element(by.css('.m-capture-save-to-album-button')).click();
    browser.sleep(1000);

    element.all(by.css('minds-archive-grid > a')).get(0).click();
    browser.sleep(1000);
    expect(element(by.css('.m-license-info')).getText()).toContain('attribution-cc');

  });

  it('should allow creating an album', () => {
    element(by.css('.m-album-add')).click();
    expect(element(by.css('.m-album-create')).isDisplayed()).toEqual(true);
    element(by.css('.m-album-create input')).sendKeys("test");
    element(by.css('.m-album-create button')).click();

    browser.wait(() => {
      return element(by.cssContainingText('.m-album h2', 'test')).isPresent();
    });

    expect(element(by.cssContainingText('.m-album h2', 'test')).isPresent()).toEqual(true);
  });

  it('should allow us to delete an album', () => {
    browser.wait(() => {
      return element(by.css('.m-albums-selector .mdl-progress')).isDisplayed().then((displayed) => { return !displayed });
    });
    expect(element(by.cssContainingText('.m-album h2', 'test')).isPresent()).toEqual(true);

    var elem = element(by.cssContainingText('.m-album h2', 'test'))
      .element(by.xpath('..'))
      .element(by.xpath('..'));

      browser.actions().mouseMove(elem).perform();
      elem.element(by.css('i')).click();
      browser.switchTo().alert().accept();

      browser.sleep(1000);
      expect(element(by.cssContainingText('.m-album h2', 'test')).isPresent()).toEqual(false);
  });

});
