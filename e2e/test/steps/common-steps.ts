namespace CommonSteps {
  const { I, loginPage } = inject();

  Given('I am logged in', (): void => {
    I.amOnPage(loginPage.loginURI);
    loginPage.login(loginPage.validUsername, loginPage.validPassword);
    I.seeCookie('minds_sess');
  });

  Given('I am logged out', (): void => void 0);
}
