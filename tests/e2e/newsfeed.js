import { Helpers } from './helpers';

let h = new Helpers();

describe('testing newsfeed', () => {

  beforeAll((done) => {
    h.login();
    browser.get('/newsfeed').then(() => {
      done();
    });
  })

  afterAll(() => {
    h.logout();
  });

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

});
