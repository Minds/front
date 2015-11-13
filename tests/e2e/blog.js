import { Helpers } from './helpers';

let h = new Helpers();

describe('testing blogs', () => {

  beforeAll(() => {
    h.login();
  })

  it('should not allow access to blog creator if not loggedin', () => {
    h.logout();
    browser.get('/blog/edit/new');
    expect(browser.getCurrentUrl()).toBe(browser.baseUrl + 'login');
    h.login();
  });

  it('featured should have title', function(){
    browser.get('/blog/featured');
    expect(browser.getTitle()).toEqual("Featured Blogs | Minds");
  });

  it('trending should have title', function(){
    browser.get('/blog/trending');
    expect(browser.getTitle()).toEqual("Trending Blogs | Minds");
  });

  it('owner should have title', function(){
    browser.get('/blog/owner');
    expect(browser.getTitle()).toEqual("Blogs | Minds");
  });

  it('editor should have title', function(){
    browser.get('/blog/edit/new');
    expect(browser.getTitle()).toEqual("New Blog | Minds");
  });

  it('editor should have banner component', function() {
    browser.get('/blog/edit/new');
    expect(element(by.css('.minds-banner')).isPresent()).toEqual(true);
  });

  it('editor should have title', function(){
    browser.get('/blog/edit/new');
    expect(element(by.css('.m-h1-input')).isPresent()).toEqual(true);
  });

  it('editor should have additional block component', function(){
    browser.get('/blog/edit/new');
    expect(element(by.css('.m-additional-block')).isPresent()).toEqual(true);
  });

  it('editor should have publish button', function(){
    browser.get('/blog/edit/new');
    expect(element(by.css('.minds-blog-save')).isPresent()).toEqual(true);
  });

  it('editor should have tinymce component', function(){
    browser.get('/blog/edit/new');
    expect(element(by.css('.mce-tinymce')).isPresent()).toEqual(true);
  });

});
