namespace CommonSteps {
  const { I, loginPage } = inject();

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

  Given(
    'I am logged in as {string}',
    async (username: string): Promise<void> => {
      I.clearCookie();

      let password;

      switch (username) {
        case process.env.SUPERMIND_SENDER_USERNAME:
          password = process.env.SUPERMIND_SENDER_PASSWORD;
          break;
        default:
          password = process.env.PLAYWRIGHT_PASSWORD;
          break;
      }

      I.amOnPage(loginPage.loginURI);
      loginPage.login(username, password);
      I.seeCookie('minds_sess');
    }
  );

  When('I switch users to {string}', (username: string) => {
    I.clearCookie();

    let password;

    switch (username) {
      case process.env.SUPERMIND_SENDER_USERNAME:
        password = process.env.SUPERMIND_SENDER_PASSWORD;
        break;
      default:
        password = process.env.PLAYWRIGHT_PASSWORD;
        break;
    }

    I.amOnPage(loginPage.loginURI);
    loginPage.login(username, password);
    I.seeCookie('minds_sess');
  });

  Given('I am logged out', (): void => {
    I.clearCookie('minds_sess');
  });

  Then('I should see {string} in current URL', (path: string) => {
    I.seeInCurrentUrl(path);
  });

  Then(
    'I see a {string} toaster containing {string}',
    (state: string, text: string) => {
      I.seeElement(locate(`.m-toaster__iconWrapper--${state}`));
      I.seeElement(locate(`.m-toaster__wrapper`).withText(text));
    }
  );
}
