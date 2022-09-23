namespace BoostMarketingSteps {
  const { I, boostMarketingPage } = inject();

  Before(() => {});

  When('I am on the boost marketing page', () => {
    I.amOnPage(boostMarketingPage.boostURI);
  });

  Then('I see create boost button', () => {
    I.waitForElement(boostMarketingPage.createBoostButton, 5);
    I.seeElement(boostMarketingPage.createBoostButton);
    I.seeElement(locate('div').withText('Create Boost'));
    I.click(boostMarketingPage.createBoostButton);
    I.seeInCurrentUrl(boostMarketingPage.boostPathname);
  });

  After(() => {});
}
