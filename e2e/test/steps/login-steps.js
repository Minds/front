const { I, loginPage } = inject();

Given('I am on Login page', () => {
  I.amOnPage('/login');
});

When('I pass valid credentials', () => {
  I.seeElement('#username');
  I.fillField('#username', loginPage.username); 
  I.seeElement('#password');
  I.fillField('#password', loginPage.password);
  I.click(locate('button').withText('Login'));
});

Then('I am taken to Home page', () => {
  I.seeElement('[title="Home"]');
});
