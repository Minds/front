import ChannelPage from '../pages/channelPage';
import CommonPage from '../pages/commonPage';

namespace CommonSteps {
  const { I, loginPage, newsfeedPage } = inject();

  const commonPage = new CommonPage();
  const channelPage = new ChannelPage();

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

  Given('I am on the {string} channel page', username => {
    I.amOnPage('/' + username);
  });

  //

  Then(
    'I sould see an {string} toaster saying {string}',
    (toasterType, toasterText) => {
      I.see(toasterText, commonPage.toaster);
      I.seeElement(`${commonPage.toasterTypePrefix}${toasterType}`);
    }
  );

  Then('I should see {string} in current URL', (path: string) => {
    I.seeInCurrentUrl(path);
  });
}
