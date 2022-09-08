namespace RewardsSteps {
  const { I, rewardsPage } = inject();

  When('I am on the rewards page', () => {
    I.amOnPage(rewardsPage.rewardsURI);
  });

  Then('I see join rewards button', () => {
    I.waitForElement(rewardsPage.buyButton, 5);
    I.seeElement(rewardsPage.buyButton);
    I.seeElement(locate('div').withText('Buy Tokens'));
    I.click(locate('div').withText('Buy Tokens'));
    I.seeElement(rewardsPage.rewardsModal);
  });
}
