import devtoolsPage from '../pages/devtoolsPage';
import loginPage from '../pages/loginPage';
const { I } = inject();

Given('I am logged in on the devtools page', (): void => {
  I.amOnPage(loginPage.loginURI);
  loginPage.login(loginPage.validUsername, loginPage.validPassword);
  I.seeCookie('minds_sess');
  I.amOnPage(devtoolsPage.uri);
});

When('I switch environments to Staging', (): void => {
  devtoolsPage.selectRadioButton('staging');
  devtoolsPage.submitChange();
  // reload instead of waiting on window.location.reload.
  I.refreshPage();
});

When('I switch environments to Canary', (): void => {
  devtoolsPage.selectRadioButton('canary');
  devtoolsPage.submitChange();
  // reload instead of waiting on window.location.reload.
  I.refreshPage();
});

Then('I see my environment as Staging', (): void => {
  I.seeElement(locate('.m-environmentFlag__flag').withText('Staging'));
});

Then('I see my environment as Canary', (): void => {
  I.seeElement(locate('.m-environmentFlag__flag').withText('Canary'));
});

// When('I switch environments to Production', (): void => {
//   devtoolsPage.selectRadioButton('production');
//   devtoolsPage.submitChange();
//   // reload instead of waiting on window.location.reload.
//   I.amOnPage(devtoolsPage.uri);
// });

// Then('I see my environment as Production', (): void => {
//   I.seeElement(locate('.m-environmentFlag__flag').withText(''));
// });
