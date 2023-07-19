import {
  SupermindConsoleSubPage,
  SupermindConsoleTab,
} from '../types/supermind-console.types';

namespace SupermindConsoleSteps {
  const {
    supermindConsolePage,
    composerModalComponent,
    confirmationModalComponent,
    supermindOnboardingModalComponent,
  } = inject();

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

  When(
    'I click to change Supermind Console status filter to {string} with value {string}',
    async (filterText: string, filterValue: string) => {
      await supermindConsolePage.switchStatusFilter(filterText, filterValue);
    }
  );

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

  Then('I see the Supermind explore feed', (): void => {
    supermindConsolePage.hasSupermindExploreFeed();
  });

  When('I make a supermind offer', () => {
    composerModalComponent.shouldHaveSupermindBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickSupermindIcon();
    composerModalComponent.clickSupermindPanelTab('Tokens');
    composerModalComponent.addSupermindTarget(
      process.env.PLAYWRIGHT_USERNAME ?? ''
    );
    composerModalComponent.enterSupermindAmount(10);
    composerModalComponent.acceptSupermindTerms();
    composerModalComponent.acceptSupermindRefundPolicy();
    composerModalComponent.clickSupermindSave();
    confirmationModalComponent.shouldBeVisible(false);
    composerModalComponent.clickPost();
    confirmationModalComponent.shouldBeVisible(true);
    confirmationModalComponent.clickConfirm();
  });

  Given('I make a supermind offer to {string}', (targetUsername: string) => {
    composerModalComponent.shouldHaveSupermindBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickSupermindIcon();
    composerModalComponent.clickSupermindPanelTab('Tokens');
    composerModalComponent.addSupermindTarget(targetUsername);
    composerModalComponent.enterSupermindAmount(10);
    composerModalComponent.acceptSupermindTerms();
    composerModalComponent.acceptSupermindRefundPolicy();
    composerModalComponent.clickSupermindSave();
    composerModalComponent.clickPost();
    confirmationModalComponent.shouldBeVisible(true);
    confirmationModalComponent.clickConfirm();
  });

  When('I try to make an NSFW supermind offer', () => {
    composerModalComponent.shouldHaveSupermindBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickSupermindIcon();
    composerModalComponent.clickSupermindPanelTab('Tokens');
    composerModalComponent.addSupermindTarget(
      process.env.PLAYWRIGHT_USERNAME ?? ''
    );
    composerModalComponent.enterSupermindAmount(10);
    composerModalComponent.acceptSupermindTerms();
    composerModalComponent.acceptSupermindRefundPolicy();
    composerModalComponent.clickSupermindSave();

    composerModalComponent.clickNsfwOption();
    composerModalComponent.clickNsfwSaveOption();
  });

  When('I make a supermind reply', () => {
    composerModalComponent.shouldHaveSupermindBadge(true);
    composerModalComponent.shouldHaveEllipsisMenu(false);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickPost();
    composerModalComponent.clickConfirmReplyButton();
  });

  When('I try to make an NSFW supermind reply', () => {
    composerModalComponent.shouldHaveSupermindBadge(true);
    composerModalComponent.shouldHaveEllipsisMenu(false);
    composerModalComponent.typeInTextArea('hello');

    composerModalComponent.clickNsfwOption();
    composerModalComponent.clickNsfwSaveOption();
  });

  When('I navigate via sidebar to the supermind console', async () => {
    supermindConsolePage.navigateToViaSidebar();
  });

  When('I click {string} on latest Supermind', async (buttonType: string) => {
    switch (buttonType) {
      case 'decline':
        await supermindConsolePage.clickDecline();
        break;
      case 'cancel':
        supermindConsolePage.clickCancelOffer();
        break;
      case 'accept':
        supermindConsolePage.clickAccept();
        break;
    }
  });

  When('I see the supermind reply onboarding modal', () => {
    supermindOnboardingModalComponent.replyModalShouldBeVisible(true);
  });

  When('I click the action button in the Supermind onboarding modal', () => {
    supermindOnboardingModalComponent.clickContinue();
  });

  //

  Then('the latest supermind offer should be {string}', (state: string) => {
    switch (state) {
      case 'declined':
        supermindConsolePage.checkSupermindNotActionable();
        supermindConsolePage.checkStateLabelContains('Declined');
        break;
      case 'accepted':
        supermindConsolePage.checkStateLabelContains('Accepted');
        break;
    }
  });

  Then(
    'on clicking the view reply button I am sent to the single entity page',
    () => {
      supermindConsolePage.clickViewReply();
    }
  );

  Then(
    'I should see my Supermind Console status filter says {string}',
    (filterText: string) => {
      supermindConsolePage.hasStatusFilterState(filterText);
    }
  );
}
