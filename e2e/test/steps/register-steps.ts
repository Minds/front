import { generateARandomString } from '../utils/utils';

namespace CommonSteps {
  const { I, topbarComponent, registerPage } = inject();

  Given('I set up registration bypass cookies', () => {
    registerPage.setupRegistrationBypassCookies();
  });

  Given('I open register form from topbar', () => {
    topbarComponent.clickJoinNowButton();
  });

  Given('I submit the register form with random data', () => {
    const username = generateARandomString();
    const email = 'noreply@minds.com';
    const password = generateARandomString() + 'A1!';

    registerPage.fillForm(username, password, email);
    registerPage.clickJoinNow();

    I.waitForNavigation({ timeout: 30000 });
  });
}
