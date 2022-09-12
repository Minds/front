import {
  SupermindConsoleSubPage,
  SupermindConsoleTab,
} from '../types/supermind-console.types';

require('dotenv').config();
const { I } = inject();

class SupermindConsolePage {
  /** @type { string }  - root uri of the page */
  private baseUrl: string = '/supermind';

  // Page elements
  private title: CodeceptJS.Locator = locate('h3').withText('Supermind');
  private tab: CodeceptJS.Locator = locate('.m-tabs__tab');
  private selectedTab: CodeceptJS.Locator = locate('.m-tabs__tab--selected');
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
  private expirationTimeLabel: CodeceptJS.Locator = locate(
    '.m-supermindListItem__expirationTimeLabel'
  ).withText('Expires: ');
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

  /**
   * Navigate to the supermind page by subpage.
   * @param { string } subpage - inbox or outbox
   * @returns { void }
   */
  public navigateTo(subpage: SupermindConsoleSubPage = 'inbox'): void {
    I.amOnPage(`${this.baseUrl}/${subpage}`);
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
   * Check if page has appropriate superminds for given subpage.
   * @param { SupermindConsoleSubPage } subpage - subpage to check you have superminds for.
   * @returns { void }
   */
  public hasSuperminds(subpage: SupermindConsoleSubPage): void {
    I.seeElement(this.listItem);
    I.seeElement(this.activity);
    I.seeElement(this.chipBadge);
    I.seeElement(this.expirationTimeLabel);
    I.seeElement(this.requirementsLabel);

    if (subpage === 'inbox') {
      I.seeElement(this.addBankPrompt);
      I.seeElement(this.declineButton);
      I.seeElement(this.acceptButton);
      I.dontSeeElement(this.cancelOfferButton);
    }

    if (subpage === 'outbox') {
      I.dontSeeElement(this.addBankPrompt);
      I.dontSeeElement(this.declineButton);
      I.dontSeeElement(this.acceptButton);
      I.seeElement(this.cancelOfferButton);
    }
  }

  /**
   * Click add bank prompt - WILL REDIRECT.
   * @returns { void }
   */
  public clickAddBankPrompt(): void {
    I.click(this.addBankPromptLink);
  }

  /**
   * Click to switch tabs.
   * @returns { void }
   */
  public switchTabs(tab: SupermindConsoleTab): void {
    I.click(locate(this.tab).withText(tab));
  }
}

export = SupermindConsolePage;
