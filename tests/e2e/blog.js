describe('testing blogs', () => {
  var subject;
  var result;


  beforeEach(function() {

  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });

  it('featured should have title', function(){
    browser.get('/blog/featured');
    subject = browser.getTitle();
    result  = 'Blogs | Minds';
  });

  it('trending should have title', function(){
    browser.get('/blog/trending');
    subject = browser.getTitle();
    result  = 'Blogs | Minds';
  });

  it('owner should have title', function(){
    browser.get('/blog/owner');
    subject = browser.getTitle();
    result  = 'Blogs | Minds';
  });

  it('editor should have title', function(){
    browser.get('/blog/edit/new');
    subject = browser.getTitle();
    result  = 'New Blog | Minds';
  });

  it('editor should have banner component', function() {
    browser.get('/blog/edit/new');
    subject = element(by.css('.minds-banner')).isPresent();
    result  = true;
  });

  it('editor should have title', function(){
    browser.get('/blog/edit/new');
    subject = element(by.css('.m-h1-input')).isPresent();
    result  = true;
  });

  it('editor should have additional block component', function(){
    browser.get('/blog/edit/new');
    subject = element(by.css('.m-additional-block')).isPresent();
    result  = true;
  });

  it('editor should have publish button', function(){
    browser.get('/blog/edit/new');
    subject = element(by.css('.minds-blog-save')).isPresent();
    result  = true;
  });

  it('editor should have tinymce component', function(){
    browser.get('/blog/edit/new');
    subject = element(by.css('.mce-tinymce')).isPresent();
    result  = true;
  });

});
