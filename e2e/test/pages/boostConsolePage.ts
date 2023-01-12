import userMenuComponent from '../fragments/userMenuComponent';
import {
  BoostConsoleLocationTab,
  BoostConsoleStateFilterValue,
} from '../types/boost-console.types';

const { I } = inject();

class BoostConsolePage {
  /** @type { string }  - root uri of the page */
  private baseUrl: string = '/boost/boost-console';
  private baseEndpoint: string =
    'when i click to change boost console tabs to ';

  // Page elements
  private title: CodeceptJS.Locator = locate('h3').withText('Boost');
  private tab: CodeceptJS.Locator = locate('.m-tabs__tab');
  private selectedTab: CodeceptJS.Locator = locate('.m-tabs__tab--selected');

  private listItem: CodeceptJS.Locator = locate('m-boostConsole__listItem');
  private activity: CodeceptJS.Locator = locate('m-activity');
  private publisherCard: CodeceptJS.Locator = locate('m-publisherCard');
  private chipBadge: CodeceptJS.Locator = locate('m-chipBadge');
  private stateLabel: CodeceptJS.Locator = locate(
    'm-boostConsole__stateLabel span'
  );
  private statsBar: CodeceptJS.Locator = locate('m-boostConsole__statsBar');

  private rejectionReason: CodeceptJS.Locator = locate(
    '[data-ref=m-boostConsole__statsBar--rejectionReason]'
  );
  private startDate: CodeceptJS.Locator = locate(
    '[data-ref=m-boostConsole__statsBar--startDate]'
  );

  private boostActionButtons: CodeceptJS.Locator = locate(
    'm-boostConsole__actionButtons'
  );
  private cancelButton: CodeceptJS.Locator = locate('m-button').withText(
    'Cancel boost'
  );
  private rejectButton: CodeceptJS.Locator = locate('m-button').withText(
    'Reject'
  );
  private approveButton: CodeceptJS.Locator = locate('m-button').withText(
    'Approve boost'
  );

  private stateFilterTrigger: CodeceptJS.Locator = locate(
    '[data-ref=m-boostConsole__filterTrigger--state]'
  );

  private stateFilterLabel: CodeceptJS.Locator = locate(
    '[data-ref=m-boostConsole__filterLabel--state]'
  );

  /**
   * Navigate to the boost console page by queryParams.
   * @param { string } queryParams
   * @returns { void }
   */
  public navigateToViaUrl(queryParams: string = ''): void {
    I.amOnPage(`${this.baseUrl}?${queryParams}`);
  }

  /**
   * Navigate to console via user menu.
   * @returns { Promise<void> }
   */
  public async navigateToViaUserMenu(): Promise<void> {
    userMenuComponent.openMenu();
    await Promise.all([
      userMenuComponent.openBoostConsole(),
      I.waitForResponse(
        resp => resp.url().includes(this.baseEndpoint) && resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Check if title can be seen.
   * @returns { void }
   */
  public hasTitle(): void {
    I.seeElement(this.title);
  }

  /**
   * Check if selected tab matches expected tab.
   * @param { BoostConsoleTab } - tab - expected tab.
   * @returns { void }
   */
  public hasTabSelected(tab: BoostConsoleLocationTab): void {
    I.seeElement(locate(this.selectedTab).withText(tab));
  }

  /**
   * Check if filter has state.
   * @param { string } stateFilterLabel - filter label for states, e.g. 'Pending', 'Approved'.
   * @returns { void }
   */
  public hasStateFilterLabel(stateFilterLabel: string): void {
    I.seeElement(this.stateFilterLabel.withText(stateFilterLabel));
  }

  /**
   * Check if page has appropriate boosts for given location tab.
   * @param { BoostConsoleLocationTab } tab - location to check you have boosts for.
   * @returns { void }
   */
  public hasBoostsInLocationTab(tab: BoostConsoleLocationTab): void {
    I.seeElement(this.listItem);
    I.seeElement(this.chipBadge);
    I.seeElement(this.stateLabel);

    if (tab === 'Newsfeed') {
      I.seeElement(this.activity);
      I.dontSeeElement(this.publisherCard);
    }

    if (tab === 'Sidebar') {
      I.seeElement(this.publisherCard);
      I.dontSeeElement(this.activity);
    }
  }

  /**
   * Check if page has appropriate boosts for given state filter value.
   * @param { BoostConsoleStateFilterValue } state - state to check you have boosts for.
   * @returns { void }
   */
  public hasBoostsInState(state: BoostConsoleStateFilterValue): void {
    I.seeElement(this.listItem);
    I.seeElement(this.chipBadge);
    I.seeElement(this.stateLabel);

    if (state === 'Pending') {
      I.seeElement(this.cancelButton);
    }
    if (state !== 'Pending') {
      I.dontSeeElement(this.cancelButton);
    }

    if (state === 'Rejected') {
      I.seeElement(this.rejectionReason);
    }

    if (state === 'Approved') {
      I.seeElement(this.startDate);
    }
  }

  /**
   * Click to switch tabs.
   * @returns { Promise<void> }
   */
  public async switchTabs(tab: BoostConsoleLocationTab): Promise<void> {
    await Promise.all([
      I.click(locate(this.tab).withText(tab)),
      I.waitForResponse(
        resp => resp.url().includes(this.baseEndpoint) && resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Click to switch state filter.
   * @param { string } stateFilterValue - state filter value, e.g. 'Pending'
   * @returns { Promise<void> }
   */
  public async switchStateFilter(stateFilterValue: string): Promise<void> {
    I.scrollPageToTop();
    I.click(this.stateFilterTrigger);
    await I.clickAndWait(
      this.stateFilterLabel.withText(stateFilterValue),
      `state=${stateFilterValue}`
    );
    pause(); //ojm
  }

  /**
   * Click approve.
   * @param { number } feedPosition - position in feed for approve button click.
   * @return { void }
   */
  public clickApprove(feedPosition: number = 1): void {
    I.click(this.approveButton.at(feedPosition));
  }

  /**
   * Click Reject.
   * @param { number } feedPosition - position in feed for reject button click.
   * @return { Promise<void> }
   */
  public async clickReject(feedPosition: number = 1): Promise<void> {
    await Promise.all([
      I.click(this.rejectButton.at(feedPosition)),
      I.waitForResponse(
        resp =>
          new RegExp(/api\/v3\/boosts\/admin\/\d+\/reject/).test(resp.url()) &&
          resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Click Cancel boost.
   * @param { number } feedPosition - position in feed for cancel offer button click.
   * @return { void }
   */
  public clickCancel(feedPosition: number = 1): void {
    I.click(this.cancelButton.at(feedPosition));
  }

  /**
   * Check that boost is not actionable (has no action buttons).
   * @param { number } feedPosition - position in feed for list item to check.
   * @return { void }
   */
  public checkBoostNotActionable(feedPosition: number = 1): void {
    I.dontSeeElement(
      this.listItem.at(feedPosition).find(this.boostActionButtons)
    );
  }

  /**
   * Check that boost at feed position has a state labeling reading that of the label param.
   * @param { BoostConsoleStateFilterValue } label - text to check for.
   * @param { number } feedPosition - position in feed for list item to check.
   * @return { void }
   */
  public checkStateLabelContains(
    label: BoostConsoleStateFilterValue,
    feedPosition: number = 1
  ): void {
    within(this.listItem.at(feedPosition), () => {
      this.stateLabel.withText(label);
    });
  }
}

export = new BoostConsolePage();
