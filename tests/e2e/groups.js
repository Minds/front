describe('testing groups', () => {

  beforeEach(function() {

  });

  afterEach(function() {
  });

  it('featured should have title', function(){
    browser.get('/groups/featured');
    expect(browser.getTitle()).toEqual("Groups | Minds");
  });

  it('member should have title', function(){
    browser.get('/groups/member');
    expect(browser.getTitle()).toEqual("Groups | Minds");
  });

});
