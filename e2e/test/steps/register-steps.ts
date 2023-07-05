import { generateARandomString } from '../utils/utils';
import mockOnboardingResponse from '../scripts/generated/strapi-onboarding-version-response.json';
import { Request } from 'playwright';

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

    I.mockRouteAndBypassServiceWorker(
      '**/graphql',
      {
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockOnboardingResponse),
      },
      (request: Request): boolean => {
        return request.postData().includes('FetchOnboardingV5Versions');
      }
    );

    registerPage.fillForm(username, password, email);
    registerPage.clickJoinNow();

    I.waitForNavigation({ timeout: 30000 });
  });
}
