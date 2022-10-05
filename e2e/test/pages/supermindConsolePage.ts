import { SidebarComponent } from '../components/sidebarComponent';
import {
  SupermindConsoleSubPage,
  SupermindConsoleTab,
} from '../types/supermind-console.types';

require('dotenv').config();
const { I } = inject();
const sidebarComponent = new SidebarComponent();

export class SupermindConsolePage {
  /** @type { string }  - root uri of the page */
  private baseUrl: string = '/supermind';

  // Page elements
  private title: CodeceptJS.Locator = locate('h3').withText('Supermind');
  private tab: CodeceptJS.Locator = locate('.m-tabs__tab');
  private selectedTab: CodeceptJS.Locator = locate('.m-tabs__tab--selected');
  private targetField: CodeceptJS.Locator = locate(
    '.m-supermindListItem__offerInformation'
  ).withText('Target:');
  private cancelOfferButton: CodeceptJS.Locator = locate('m-button').withText(
    'Cancel Offer'
  );
  private declineButton: CodeceptJS.Locator = locate('m-button').withText(
    'Decline'
  );
  private acceptButton: CodeceptJS.Locator = locate('m-button').withText(
    'Accept Offer'
  );
  private listItem: CodeceptJS.Locator = locate('m-supermind__listItem');
  private activity: CodeceptJS.Locator = locate('m-activity');
  private chipBadge: CodeceptJS.Locator = locate('m-chipBadge');
  private stateLabel: CodeceptJS.Locator = locate(
    'm-supermind__stateLabel span'
  );
  private requirementsLabel: CodeceptJS.Locator = locate(
    '.m-supermindListItem__requirementsLabel'
  );
  private settingsCog: CodeceptJS.Locator = locate(
    '.m-supermindConsole__settingsButtonIcon'
  );
  private addBankPrompt: CodeceptJS.Locator = locate('m-addBankPrompt');
  private addBankPromptLink: CodeceptJS.Locator = locate(
    '.m-addBankPrompt__link'
  );
  private supermindListItem: CodeceptJS.Locator = locate(
    '.m-supermind__listItem'
  );
  private supermindActionButtons: CodeceptJS.Locator = locate(
    '.m-supermindListItem__actionButtons'
  );
  private statusFilterTrigger: CodeceptJS.Locator = locate(
    '.m-supermindConsole__filterTrigger'
  );
  private statusFilterLabel: CodeceptJS.Locator = locate(
    '.m-supermindConsole__filterLabel'
  );

  /**
   * Navigate to the supermind page by subpage.
   * @param { string } subpage - inbox or outbox
   * @returns { void }
   */
  public navigateTo(subpage: SupermindConsoleSubPage = 'inbox'): void {
    I.amOnPage(`${this.baseUrl}/${subpage}`);
  }

  /**
   * Navigate to console via sidebar.
   * @returns { Promise<void> }
   */
  public async navigateToViaSidebar(): Promise<void> {
    sidebarComponent.expandSidebarMore();
    await Promise.all([
      sidebarComponent.openSupermindConsole(),
      I.waitForResponse(
        resp =>
          resp.url().includes('/api/v3/supermind') && resp.status() === 200,
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
   * @param { SupermindConsoleTab } - tab - expected tab.
   * @returns { void }
   */
  public hasTabSelected(tab: SupermindConsoleTab): void {
    I.seeElement(locate(this.selectedTab).withText(tab));
  }

  /**
   * Check if page has settings cog.
   * @returns { void }
   */
  public hasSettingsCog(): void {
    I.seeElement(locate(this.settingsCog));
  }

  /**
   * Check if filter has state.
   * @param { string } stateFilterLabel - filter label for states, e.g. 'Pending', 'Accepted'.
   * @returns { void }
   */
  public hasStatusFilterState(stateFilterLabel: string): void {
    I.seeElement(this.statusFilterLabel.withText(stateFilterLabel));
  }

  /**
   * Click settings cog.
   * @returns { void }
   */
  public clickSettingsCog(): void {
    I.click(this.settingsCog);
  }

  /**
   * Check if page has appropriate superminds for given subpage.
   * @param { SupermindConsoleSubPage } subpage - subpage to check you have superminds for.
   * @returns { void }
   */
  public hasSuperminds(subpage: SupermindConsoleSubPage): void {
    I.seeElement(this.listItem);
    I.seeElement(this.activity);
    I.seeElement(this.chipBadge);
    I.seeElement(this.stateLabel);
    I.seeElement(this.requirementsLabel);

    if (subpage === 'inbox') {
      I.seeElement(this.addBankPrompt);
      I.dontSeeElement(this.targetField);
      //I.seeElement(this.declineButton); // Buttons not available if offer already accepted/declined.
      //I.seeElement(this.acceptButton); // Buttons not available if offer already accepted/declined.
      //I.dontSeeElement(this.cancelOfferButton);
    }

    if (subpage === 'outbox') {
      I.dontSeeElement(this.addBankPrompt);
      I.seeElement(this.targetField);
      //I.dontSeeElement(this.declineButton); // Buttons not available if offer already accepted/declined.
      //I.dontSeeElement(this.acceptButton); // Buttons not available if offer already accepted/declined.
      // TODO: Uncomment when we bring back the cancel offer button.
      // I.seeElement(this.cancelOfferButton);
    }
  }

  /**
   * Click add bank prompt - WILL REDIRECT.
   * @returns { void }
   */
  public clickAddBankPrompt(): void {
    I.click(this.addBankPromptLink);
    I.waitForNavigation({});
  }

  /**
   * Click to switch tabs.
   * @returns { Promise<void> }
   */
  public async switchTabs(tab: SupermindConsoleTab): Promise<void> {
    await Promise.all([
      I.click(locate(this.tab).withText(tab)),
      I.waitForResponse(
        resp =>
          resp.url().includes('/api/v3/supermind') && resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Click to switch state filter.
   * @param { string } stateFilterLabel - filter label for states, e.g. 'Pending', 'Accepted'.
   * @param { string } stateValue - value behind filter, "1", "2", "3".
   * @returns { Promise<void> }
   */
  public async switchStatusFilter(
    stateFilterLabel: string,
    stateValue: string
  ): Promise<void> {
    I.click(this.statusFilterTrigger);
    await Promise.all([
      I.click(this.statusFilterLabel.withText(stateFilterLabel)),
      I.waitForResponse(
        resp =>
          resp.url().includes(`&status=${stateValue}`) && resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Click accept.
   * @param { number } feedPosition - position in feed for accept button click.
   * @return { void }
   */
  public clickAccept(feedPosition: number = 1): void {
    // opens composer, does not fire a request.
    I.click(this.acceptButton.at(feedPosition));
  }

  /**
   * Click Decline.
   * @param { number } feedPosition - position in feed for decline button click.
   * @return { Promise<void> }
   */
  public async clickDecline(feedPosition: number = 1): Promise<void> {
    await Promise.all([
      I.click(this.declineButton.at(feedPosition)),
      I.waitForResponse(
        resp =>
          new RegExp(/api\/v3\/supermind\/\d+\/reject/).test(resp.url()) &&
          resp.status() === 200,
        30
      ),
    ]);
  }

  /**
   * Click Cancel offer.
   * @param { number } feedPosition - position in feed for cancel offer button click.
   * @return { void }
   */
  public clickCancelOffer(feedPosition: number = 1): void {
    I.click(this.cancelOfferButton.at(feedPosition));
  }

  /**
   * Click view reply
   * @param { number } feedPosition - position of element in feed.
   */
  public clickViewReply(feedPosition: number = 1): void {
    within(this.listItem.at(feedPosition), () => {
      I.click(locate('m-button').withText('View Reply'));
    });
    I.seeInCurrentUrl('/newsfeed/');
  }

  /**
   * Check that supermind is not actionable (has no action buttons).
   * @param { number } feedPosition - position in feed for list item to check.
   * @return { void }
   */
  public checkSupermindNotActionable(feedPosition: number = 1): void {
    I.dontSeeElement(
      this.supermindListItem.at(feedPosition).find(this.supermindActionButtons)
    );
  }

  /**
   * Check that supermind at feed position has a state labeling reading that of the label param.
   * @param { number } label - text to check for.
   * @param { number } feedPosition - position in feed for list item to check.
   * @return { void }
   */
  public checkStateLabelContains(
    label: string,
    feedPosition: number = 1
  ): void {
    within(this.listItem.at(feedPosition), () => {
      this.stateLabel.withText(label);
    });
  }
}
