import DevtoolsPage from '../pages/devtoolsPage';
import { Environment } from '../types/devtools.types';

namespace DevToolsSteps {
  const devtoolsPage = new DevtoolsPage();

  Given('I am on the devtools page', (): void => {
    devtoolsPage.navigateTo();
  });

  When('I switch environments to {string}', (environment: string): void => {
    devtoolsPage.selectRadioButton(environment as Environment);
    devtoolsPage.submitChange();
  });

  When(
    'I switch environments to {string} from logged out',
    (environment: string): void => {
      devtoolsPage.selectRadioButton(environment as Environment);
      devtoolsPage.submitChange(false);
    }
  );

  Then(
    'I see my environment as {string}',
    async (environment: string): Promise<void> => {
      await devtoolsPage.checkEnvironment(environment as Environment);
    }
  );

  Then(
    'I should not see an option for canary',
    async (): Promise<void> => {
      devtoolsPage.hasNoCanaryOption();
    }
  );
}
