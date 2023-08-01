namespace GroupsSteps {
  const { groupPage } = inject();

  Given('I navigate to a group that playwright_test_user owns', () => {
    groupPage.navigateToByGuid(
      process.env.PLAYWRIGHT_USER_OWNED_GROUP_GUID ?? '1525457195343286290'
    );
  });

  Given(
    'I click to boost the group through the group settings dropdown',
    () => {
      groupPage.clickSettingsDropdownOption('Boost group');
    }
  );
}
