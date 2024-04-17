namespace LoginSteps {
  const { I, loginPage } = inject();

  Given('I am on Login page', () => {
    I.amOnPage(loginPage.loginURI);
  });

  When('I pass valid credentials', () => {
    loginPage.login(loginPage.validUsername, loginPage.validPassword);
  });

  When('I pass invalid credentials', table => {
    const tableByHeader = table.parse().hashes();
    for (const row of tableByHeader) {
      const username = row.username;
      const password = row.password;
      loginPage.login(username, password);
    }
  });

  When('I pass empty credentials', () => {
    loginPage.login('', '');
  });

  When('I pass banned credentials', () => {
    loginPage.login('test_banned_user', 'Minds@12345');
  });

  Then('I am taken to Home page', () => {
    I.waitForElement('[title="Home"]', 10);
    I.seeElement('[title="Home"]');
  });

  Then('I am still on Login page', () => {
    I.seeElement(locate('.m-auth__titleRow'));
  });

  Then('I see incorrect credentials error', () => {
    I.seeElement(
      locate('div').withText('Incorrect username/password. Please try again.')
    );
  });

  Then('I see empty credentials error', () => {
    I.seeElement(locate('div').withText('Username is required.'));
  });
}
