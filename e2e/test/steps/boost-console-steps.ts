import {
  BoostConsoleLocationTab,
  BoostConsoleStateFilterValue,
} from '../types/boost-console.types';

namespace BoostConsoleSteps {
  const { boostConsolePage } = inject();

  Given(
    'I am on the Boost Console page with query params {string}',
    (queryParams: string): void => {
      boostConsolePage.navigateToViaUrl(queryParams);
    }
  );

  Given(
    'I am on the Boost Console {string} location tab',
    (tab: BoostConsoleLocationTab): void => {
      const queryParams = boostConsolePage.navigateToViaUrl(`location=${tab}`);
    }
  );

  When('I click to change tabs to {string}', async (tab: string) => {
    await boostConsolePage.switchTabs(tab as BoostConsoleLocationTab);
  });

  When(
    'I click to change Boost Console state filter to {string}',
    async (filterValue: BoostConsoleStateFilterValue) => {
      await boostConsolePage.switchStateFilter(filterValue);
    }
  );

  Then(
    'I should see my Boost Console {string} location tab',
    (location: BoostConsoleLocationTab): void => {
      boostConsolePage.hasTitle();
      boostConsolePage.hasBoostsInLocationTab(
        location as BoostConsoleLocationTab
      );

      boostConsolePage.hasTabSelected(location);
    }
  );

  When('I make a boost offer', () => {
    composerModalComponent.shouldHaveBoostBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickBoostIcon();
    composerModalComponent.clickBoostPanelTab('Tokens');
    composerModalComponent.addBoostTarget(
      process.env.PLAYWRIGHT_USERNAME ?? ''
    );
    composerModalComponent.enterBoostAmount(10);
    composerModalComponent.acceptBoostTerms();
    composerModalComponent.acceptBoostRefundPolicy();
    composerModalComponent.clickBoostSave();
    confirmationModalComponent.shouldBeVisible(false);
    composerModalComponent.clickPost();
    confirmationModalComponent.shouldBeVisible(true);
    confirmationModalComponent.clickConfirm();
  });

  Given('I make a boost offer to {string}', (targetUsername: string) => {
    composerModalComponent.shouldHaveBoostBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickBoostIcon();
    composerModalComponent.clickBoostPanelTab('Tokens');
    composerModalComponent.addBoostTarget(targetUsername);
    composerModalComponent.enterBoostAmount(10);
    composerModalComponent.acceptBoostTerms();
    composerModalComponent.acceptBoostRefundPolicy();
    composerModalComponent.clickBoostSave();
    composerModalComponent.clickPost();
    confirmationModalComponent.shouldBeVisible(true);
    confirmationModalComponent.clickConfirm();
  });

  When('I try to make an NSFW boost offer', () => {
    composerModalComponent.shouldHaveBoostBadge(false);
    composerModalComponent.shouldHaveEllipsisMenu(true);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickBoostIcon();
    composerModalComponent.clickBoostPanelTab('Tokens');
    composerModalComponent.addBoostTarget(
      process.env.PLAYWRIGHT_USERNAME ?? ''
    );
    composerModalComponent.enterBoostAmount(10);
    composerModalComponent.acceptBoostTerms();
    composerModalComponent.acceptBoostRefundPolicy();
    composerModalComponent.clickBoostSave();

    composerModalComponent.clickNsfwOption();
    composerModalComponent.clickNsfwSaveOption();
  });

  When('I make a boost reply', () => {
    composerModalComponent.shouldHaveBoostBadge(true);
    composerModalComponent.shouldHaveEllipsisMenu(false);
    composerModalComponent.typeInTextArea('hello');
    composerModalComponent.clickPost();
    composerModalComponent.clickConfirmReplyButton();
  });

  When('I try to make an NSFW boost reply', () => {
    composerModalComponent.shouldHaveBoostBadge(true);
    composerModalComponent.shouldHaveEllipsisMenu(false);
    composerModalComponent.typeInTextArea('hello');

    composerModalComponent.clickNsfwOption();
    composerModalComponent.clickNsfwSaveOption();
  });

  When('I navigate via user menu to the boost console', async () => {
    await boostConsolePage.navigateToViaUserMenu();
    boostConsolePage.hasTabSelected('Newsfeed');
  });

  When('I click {string} on latest Boost', async (buttonType: string) => {
    switch (buttonType) {
      case 'reject':
        await boostConsolePage.clickReject();
        break;
      case 'cancel':
        boostConsolePage.clickCancel();
        break;
      case 'approve':
        boostConsolePage.clickApprove();
        break;
    }
  });

  //

  Then(
    'the latest boost offer should be {string}',
    (state: BoostConsoleStateFilterValue) => {
      boostConsolePage.checkStateLabelContains(state);

      switch (state) {
        case 'Approved':
        case 'Rejected':
        case 'Completed':
          boostConsolePage.checkBoostNotActionable();
          break;
      }
    }
  );

  Then(
    'I should see my Boost Console state filter says {string}',
    (filterText: BoostConsoleStateFilterValue) => {
      boostConsolePage.hasStateFilterLabel(filterText);
    }
  );
}
