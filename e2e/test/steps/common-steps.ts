import CommonPage from '../pages/commonPage';

namespace CommonSteps {
  const { I, loginPage, newsfeedPage } = inject();

  const commonPage = new CommonPage();

  Given(
    'I am logged in',
    async (): Promise<void> => {
      if (await I.grabCookie('minds_sess')) {
        return;
      }

      I.amOnPage(loginPage.loginURI);
      loginPage.login(loginPage.validUsername, loginPage.validPassword);
      I.seeCookie('minds_sess');
    }
  );

  Given('I am logged out', (): void => {
    I.clearCookie('minds_sess');
  });

  Given('I am on the newsfeed', () => {
    I.amOnPage(newsfeedPage.newsfeedURI);
  });

  //

  Then(
    'I sould see an {string} toaster saying {string}',
    (toasterType, toasterText) => {
      I.see(toasterText, commonPage.toaster);
      I.seeElement(`${commonPage.toasterTypePrefix}${toasterType}`);
    }
  );
}
