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
    'I am on the Boost Console with location query string param {string}',
    (tab: BoostConsoleLocationTab): void => {
      boostConsolePage.navigateToViaUrl(`location=${tab}`);
    }
  );

  Given(
    'I am on the single boost Boost Console page for a wrong audience rejected boost',
    (filterValue: BoostConsoleStateFilterValue) => {
      const boostGuid: string =
        process.env.PLAYWRIGHT_USER_WRONG_AUDIENCE_REJECTED_BOOST_GUID ??
        '1479527488425037836';
      boostConsolePage.navigateToViaUrl(`boostGuid=${boostGuid}`);
    }
  );

  When(
    'I click to change Boost Console tabs to {string}',
    async (tab: string) => {
      await boostConsolePage.switchTabs(tab as BoostConsoleLocationTab);
    }
  );

  When(
    'I click to change Boost Console state filter to {string}',
    async (filterValue: BoostConsoleStateFilterValue) => {
      await boostConsolePage.switchStateFilter(filterValue);
    }
  );

  When('I click to boost again', () => {
    boostConsolePage.clickBoostAgain();
  });

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

  When('I navigate via user menu to the boost console', async () => {
    await boostConsolePage.navigateToViaUserMenu();
    boostConsolePage.hasTabSelected('Posts');
  });

  When('I click {string} on latest Boost', async (buttonType: string) => {
    switch (buttonType) {
      case 'cancel':
        boostConsolePage.clickCancel();
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
      boostConsolePage.hasStateFilterTriggerLabel(filterText);
    }
  );
}
