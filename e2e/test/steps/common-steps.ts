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

  Given('I am logged out', (): void => void 0);
}
