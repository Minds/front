namespace RewardsMarketingSteps {
  const { I, rewardsMarketingPage } = inject();

  When('I am on the rewards marketing page', () => {
    I.amOnPage(rewardsMarketingPage.rewardsURI);
  });
}
