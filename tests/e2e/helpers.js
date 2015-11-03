/**
 * Helper functions for e2e tests
 */

export class Helpers {
  login() {

    browser.executeScript('return window.Minds.LoggedIn')
      .then(result => {
        if(result){
          return;
        } else {
          browser.driver.get(browser.baseUrl + 'login');
          browser.driver.sleep(1000);

          //check if login button is present & visible
          var usernameTextField = element.all(by.id('username')).get(1);
          var passwordTextField = element.all(by.id('password')).get(1);
          var loginButton = element.all(by.css('.mdl-button')).get(3);

          usernameTextField.sendKeys('protractor');
          passwordTextField.sendKeys('password');
          loginButton.click();

          browser.driver.sleep(1000);
        }
      });

  };

  logout() {
    browser.driver.get(browser.baseUrl + 'logout');
    browser.driver.sleep(1000);
  };
};
