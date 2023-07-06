const { I, tokenMarketingPage } = inject();

When('I am on the token marketing page', () => {
  I.amOnPage(tokenMarketingPage.tokenURI);
});
