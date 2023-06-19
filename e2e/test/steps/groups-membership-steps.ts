namespace GroupsMembershipSteps {
  const { groupsMembershipPage } = inject();

  Given('I am on the groups membership page', () => {
    groupsMembershipPage.navigateToByUrl();
  });

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
    pause();
  });

  Then('I should see recommended groups', () => {
    groupsMembershipPage.hasRecommendedGroups();
    pause();
  });
}
