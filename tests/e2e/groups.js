describe('testing groups', () => {


  it('fshould have featured title', function(){
    browser.get('/groups/featured');
    expect(browser.getTitle()).toEqual("Groups | Minds");
  });

  it('should have members title', function(){
    browser.get('/groups/member');
    expect(browser.getTitle()).toEqual("Groups | Minds");
  });

});
