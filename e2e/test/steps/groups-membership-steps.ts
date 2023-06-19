namespace GroupsMembershipSteps {
  const { groupsMembershipPage } = inject();

  Given('I am on the newsfeed', () => {
    groupsMembershipPage.navigateToByUrl();
  });
}
