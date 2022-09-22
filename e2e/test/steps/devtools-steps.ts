import { DevtoolsPage } from '../pages/devtoolsPage';
import { Environment } from '../types/devtools.types';

namespace DevToolsSteps {
  const devtoolsPage = new DevtoolsPage();

  Before(() => {});

  Given('I am on the devtools page', (): void => {
    devtoolsPage.navigateTo();
  });

  When('I switch environments to {string}', (environment: string): void => {
    devtoolsPage.selectRadioButton(environment as Environment);
    devtoolsPage.submitChange();
  });

  Then(
    'I see my environment as {string}',
    async (environment: string): Promise<void> => {
      await devtoolsPage.checkEnvironment(environment as Environment);
    }
  );
  After(() => {});
}
