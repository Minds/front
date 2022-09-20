import { ComposerModal } from '../pages/composerModal';
import SupermindConsolePage from '../pages/supermindConsolePage';
import {
  SupermindConsoleSubPage,
  SupermindConsoleTab,
} from '../types/supermind-console.types';

namespace SupermindConsoleSteps {
  const supermindConsolePage = new SupermindConsolePage();
  const composerModalPage = new ComposerModal();

  Given(
    'I am on the Supermind Console {string} page',
    (context: string): void => {
      supermindConsolePage.navigateTo(context as SupermindConsoleSubPage);
    }
  );

  When('I click the prompt to add my bank information', () => {
    supermindConsolePage.clickAddBankPrompt();
  });

  When('I click to change tabs to {string}', async (tab: string) => {
    await supermindConsolePage.switchTabs(tab as SupermindConsoleTab);
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

  When('I make a supermind offer', () => {
    composerModalPage.shouldHaveSupermindBadge(false);
    composerModalPage.shouldHaveEllipsisMenu(true);
    composerModalPage.typeInTextArea('hello');
    composerModalPage.clickSupermindIcon();
    composerModalPage.clickSupermindPanelTab('Tokens');
    composerModalPage.addSupermindTarget(process.env.PLAYWRIGHT_USERNAME ?? '');
    composerModalPage.enterSupermindAmount(10);
    composerModalPage.acceptSupermindTerms();
    composerModalPage.clickSupermindSave();
    composerModalPage.clickPost();
  });

  When('I try to make an NSFW supermind offer', () => {
    composerModalPage.shouldHaveSupermindBadge(false);
    composerModalPage.shouldHaveEllipsisMenu(true);
    composerModalPage.typeInTextArea('hello');
    composerModalPage.clickSupermindIcon();
    composerModalPage.clickSupermindPanelTab('Tokens');
    composerModalPage.addSupermindTarget(process.env.PLAYWRIGHT_USERNAME ?? '');
    composerModalPage.enterSupermindAmount(10);
    composerModalPage.acceptSupermindTerms();
    composerModalPage.clickSupermindSave();

    composerModalPage.clickNsfwOption();
    composerModalPage.clickNsfwSaveOption();
  });

  When('I make a supermind reply', () => {
    composerModalPage.shouldHaveSupermindBadge(true);
    composerModalPage.shouldHaveEllipsisMenu(false);
    composerModalPage.typeInTextArea('hello');
    composerModalPage.clickPost();
  });

  When('I try to make an NSFW supermind reply', () => {
    composerModalPage.shouldHaveSupermindBadge(true);
    composerModalPage.shouldHaveEllipsisMenu(false);
    composerModalPage.typeInTextArea('hello');

    composerModalPage.clickNsfwOption();
    composerModalPage.clickNsfwSaveOption();
  });

  When('I navigate via sidebar to the supermind console', async () => {
    await supermindConsolePage.navigateToViaSidebar();
    supermindConsolePage.hasTabSelected('Inbound');
  });

  When('I click {string} on latest Supermind', (buttonType: string) => {
    switch (buttonType) {
      case 'decline':
        supermindConsolePage.clickDecline();
        break;
      case 'cancel':
        supermindConsolePage.clickCancelOffer();
        break;
      case 'accept':
        supermindConsolePage.clickAccept();
        break;
    }
  });

  Then('the supermind offer should be {string}', (state: string) => {
    /**
     * TODO: When we build out different states, we need to test states
     * - 'declined'
     * - 'cancelled'
     * - 'accepted'
     */
    supermindConsolePage.checkSupermindNotActionable();
  });
}
