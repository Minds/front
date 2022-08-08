const { I, LoginPage } = inject();

Given('I am on Login page', () => {
  I.amOnPage('/login');
});

When('I pass valid credentials', () => {
  LoginPage.login(LoginPage.validUsername, LoginPage.validPassword);
});

When('I pass invalid credentials', (table) => {
  const tableByHeader = table.parse().hashes();
  for (const row of tableByHeader) {
    const username = row.username;
    const password = row.password;
    LoginPage.login(username, password);
  }
});

When('I pass empty credentials', () => {
  LoginPage.login('', '');
});

When('I pass banned credentials', () => {
  LoginPage.login('test_banned_user', 'Minds@12345');
});

Then('I am taken to Home page', () => {
  I.seeElement('[title="Home"]');
});

Then('I am still on Login page', () => {
  I.seeElement(locate('h3').withText('Login to Minds'));
});

Then('I see incorrect credentials error', () => {
  I.seeElement(locate('div').withText('Incorrect username/password. Please try again.'));
});

Then('I see empty credentials error', () => {
  I.seeElement(locate('div').withText('Username is required.'));
});
