/**
 * Helper functions for e2e tests
 */

export class Helpers {
  login() {

    browser.wait(() => {
      return browser.executeScript('return window.Minds.LoggedIn')
        .then(result => {
          if(result){
            return true;
          } else {
            browser.driver.get(browser.baseUrl + 'login');

            browser.wait(function() {
        			return browser.isElementPresent(By.css('minds-body'));
        		});

            browser.wait(function() {
        			return browser.isElementPresent(By.id('username'));
        		});

            //check if login button is present & visible
            var usernameTextField = element.all(by.id('username')).get(0);
            var passwordTextField = element.all(by.id('password')).get(0);
            var loginButton = element.all(by.css('.mdl-button')).get(2);

            usernameTextField.sendKeys('protractor');
            passwordTextField.sendKeys('password');
            loginButton.click();

            return browser.wait(() => {
              return browser.getCurrentUrl().then(url =>  { return (url == browser.baseUrl + 'newsfeed'); } );
            });

          }
        });
      });

  };

  logout() {
    browser.driver.get(browser.baseUrl + 'logout');
    browser.wait(() => {
      return browser.getCurrentUrl().then(url => { return (url == browser.baseUrl + 'login'); });
    });
  };
};
