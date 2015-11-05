// import { verifyNoBrowserErrors } from 'angular2/src/test_lib/e2e_util';

describe('search tests', () => {

  it('should search from topbar', () => {
		browser.get('/');
		browser.sleep(1000); //wait for boot

		var search_box = element(by.id('search'));
		search_box.sendKeys("hello minds");
		search_box.sendKeys(protractor.Key.ENTER);

		browser.sleep(500); //wait one second to search
		//expect(search_box.getAttribute('value')).toEqual('hello minds');
		//expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'search?q=hello%20minds');
    search_box.getAttribute('value').then((val) => {
      expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'search?q=' + encodeURIComponent(val));
    })
  });

	it('should include query in search bar on direct link', () => {
    browser.get('/search?q=show%20me');
    browser.sleep(1000); //wait for boot
    var search_box = element(by.id('search'));
		expect(search_box.getAttribute('value')).toEqual('show me');
  });

});
