// import { verifyNoBrowserErrors } from 'angular2/src/test_lib/e2e_util';

describe('testing the tests', () => {

  it('should have a title', function(){
		browser.get('/');
    expect(browser.getTitle()).toEqual("Home | Minds");
  });

});
