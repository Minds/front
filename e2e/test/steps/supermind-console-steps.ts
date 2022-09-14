import SupermindConsolePage from '../pages/supermindConsole';
import {
  SupermindConsoleSubPage,
  SupermindConsoleTab,
} from '../types/supermind-console.types';

namespace SupermindConsoleSteps {
  const supermindConsolePage = new SupermindConsolePage();

  Given(
    'I am on the Supermind Console {string} page',
    (context: string): void => {
      supermindConsolePage.navigateTo(context as SupermindConsoleSubPage);
    }
  );

  When('I click the prompt to add my bank information', () => {
    supermindConsolePage.clickAddBankPrompt();
  });

  When('I click to change tabs to {string}', (tab: string) => {
    supermindConsolePage.switchTabs(tab as SupermindConsoleTab);
  });

  Then(
    'I should see my Supermind Console {string}',
    (context: string): void => {
      supermindConsolePage.hasTitle();
      supermindConsolePage.hasSettingsCog();
      supermindConsolePage.hasSuperminds(context as SupermindConsoleSubPage);

      if (context === 'inbox') {
        supermindConsolePage.hasTabSelected('Inbound');
      } else if (context === 'outbox') {
        supermindConsolePage.hasTabSelected('Outbound');
      }
    }
  );
}
