namespace GroupsMembershipSteps {
  const { groupsMembershipPage } = inject();

  Given('I am on the groups membership page', () => {
    groupsMembershipPage.navigateToByUrl();
  });

  Given(
    'I open the group membership feed item at position {string}',
    async (position: number) => {
      await groupsMembershipPage.openGroupAtPosition(position);
    }
  );

  // -----------------------------------------------

  When('I click the create group button', () => {
    groupsMembershipPage.clickCreateGroupButton();
  });

  When('I click the discover groups button', () => {
    groupsMembershipPage.clickDiscoverGroupsButton();
  });

  // -----------------------------------------------
  Then('I should see the no groups notice', () => {
    groupsMembershipPage.hasNoGroupsFeedNotice();
  });

  Then('I should see recommended groups', () => {
    groupsMembershipPage.hasRecommendedGroups();
  });
}
