var path = require('path');
import { Helpers } from '../helpers';

let h = new Helpers();

describe('testing subscribing features', () => {

  it('should not show subscribe button whilst logged out', () => {
    h.logout();
    browser.get('/protractor');

    expect(element(by.css('minds-button-subscribe')).isPresent()).toEqual(false);
  });

});
