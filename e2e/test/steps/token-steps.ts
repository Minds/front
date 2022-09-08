namespace TokensSteps {
  const { I, tokenPage } = inject();

  When('I am on the token page', () => {
    I.amOnPage(tokenPage.tokenURI);
  });

  Then('I see buy tokens button', () => {
    I.waitForElement(tokenPage.buyButton, 5);
    I.seeElement(tokenPage.buyButton);
    I.seeElement(locate('div').withText('Buy Tokens'));
    I.click(locate('div').withText('Buy Tokens'));
    I.seeElement(tokenPage.tokensModal);
  });
}
