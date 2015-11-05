var path = require('path');
import { Helpers } from './helpers';

let h = new Helpers();

describe('testing newsfeed', () => {

  beforeEach((done) => {
    h.login();
    browser.get('/newsfeed').then(() => {
      done();
    });
  });

  afterEach(() => {
    h.logout();
  })

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual("Newsfeed | Minds");
  });

  it('should have poster', () => {
    expect(element(by.css('minds-newsfeed-poster')).isPresent()).toEqual(true);
  });

  //it('should have activity list', function(){
  //  expect(element(by.css('minds-activity.mdl-card')).isPresent()).toEqual(true);
  //});

  it('should have user card', () => {
    expect(element(by.css('minds-card-user')).isPresent()).toEqual(true);
  });

  it('should have analytics', () => {
    expect(element(by.css('minds-analytics-impressions')).isPresent()).toEqual(true);
  });

  it('should post', () => {
    //var message = 'test post ' + Date.now();
    var message = 'test post';
    element(by.css('minds-newsfeed-poster textarea')).sendKeys(message);
    //post our message
    element(by.css('.mdl-card__actions .mdl-button')).click();
    browser.driver.sleep(1000); //1 second to type

    //post should clear
    //expect(element(by.css('minds-newsfeed-poster textarea'))).toEqual('');

    var activity = element.all(by.css('minds-activity .mdl-card__supporting-text.message')).get(0);
    expect(activity.getText()).toEqual(message);

  });

  it('should autogrow the textbox when typing', () => {
    var textarea = element(by.css('minds-newsfeed-poster textarea'));
    var height = 0;
    textarea.getSize().then((size) => { height = size.height; });

    browser.driver.sleep(300);

    textarea.sendKeys('I am now going to type a short message');
    textarea.getSize().then((size) => {
      expect(size.height).toEqual(height);
    });

    textarea.sendKeys("\n\n\n");
    textarea.getSize().then((size) => {
      expect(size.height).toBeGreaterThan(height);
    });
  });

  it('should upload a file', () => {

    //try two uploads
    for(var i = 0; i < 2; i++){
      var fileToUpload = 'res/logo.png',
        absolutePath = path.resolve(__dirname, fileToUpload);

      element(by.id('file')).sendKeys(absolutePath);

      browser.wait(() => {
        return element(by.css('.attachment-preview')).isPresent();
      });
      //check that we got a preview
      expect(element(by.css('.attachment-preview')).isDisplayed()).toEqual(true);

      browser.wait(() => {
        return element(by.css('.mdl-card__actions .mdl-button')).isEnabled();
      }, 5000); //allow a maximum of 5 seconds for uploading

      element(by.css('.mdl-card__actions .mdl-button')).click();

      browser.driver.sleep(1000); //1 second to post

      expect(element(by.css('minds-activity .item-image img')).isPresent()).toEqual(true);
    }
  });

  it('should allow us to remove a preview and upload again', () => {

    //run this flow at least twice..
    for(var i = 0; i < 2; i++){

      var fileToUpload = 'res/logo.png',
        absolutePath = path.resolve(__dirname, fileToUpload);

      element(by.id('file')).sendKeys(absolutePath);

      //check that we got a preview
      expect(element(by.css('.attachment-preview')).isDisplayed()).toEqual(true);

      browser.actions().mouseMove(element(by.css('.post-preview'))).perform();
      element(by.css('.attachment-preview-delete')).click();

      expect(element(by.css('.post-preview')).isPresent()).toEqual(false);
      browser.sleep(500);
    }

  });

});
