const { I } = inject();

/**
 * Page Object for a groups page.
 */
class GroupPage {
  private groupSettingsButtonSelector: string = 'minds-groups-settings-button';

  /**
   * Navigate to a group by guid.
   * @param { string } guid - guid of the group to navigate to.
   * @returns { void }
   */
  public navigateToByGuid(guid: string): void {
    I.amOnPage(`/group/${guid}/feed`);
  }

  /**
   * Click an option in the group settings dropdown.
   * @param { string } optionText -
   */
  public async clickSettingsDropdownOption(optionText: string): Promise<void> {
    I.click(this.groupSettingsButtonSelector);
    await within(locate(this.groupSettingsButtonSelector), async () => {
      I.click(locate('span').withText(optionText));
    });
  }
}

export = new GroupPage();
