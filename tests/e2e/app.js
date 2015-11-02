// import { verifyNoBrowserErrors } from 'angular2/src/test_lib/e2e_util';

describe('testing the tests', () => {

	beforeEach(function() {
		browser.get('/');
	});

	afterEach(function() {
	});


  it('should have a title', function(){
    expect(browser.getTitle()).toEqual("Home | Minds");
  });

  it('should have a title', function(){
    expect(browser.getTitle()).toEqual("Home | Minds");
  });

});
