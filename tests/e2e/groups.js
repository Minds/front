describe('testing groups', () => {
  var subject;
  var result;

  beforeEach(function() {

  });

  afterEach(function() {
    expect(subject).toEqual(result);
  });

  it('featured should have title', function(){
    browser.get('/groups/featured');
    subject = browser.getTitle();
    result  = 'Groups | Minds';
  });

  it('member should have title', function(){
    browser.get('/groups/member');
    subject = browser.getTitle();
    result  = 'Groups | Minds';
  });

});
