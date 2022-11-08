const { I, tokenMarketingPage } = inject();

When('I am on the token marketing page', () => {
  I.amOnPage(tokenMarketingPage.tokenURI);
});

Then('I see buy tokens button', () => {
  I.waitForElement(tokenMarketingPage.buyButton, 5);
  I.seeElement(tokenMarketingPage.buyButton);
  I.seeElement(locate('div').withText('Buy Tokens'));
  I.click(tokenMarketingPage.buyButton);
  I.seeElement(tokenMarketingPage.tokensModal);
});
