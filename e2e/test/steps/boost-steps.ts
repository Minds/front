namespace BoostSteps {
  const { I, boostPage } = inject();

  Before(() => {});

  When('I create a boosted post', () => {
    boostPage.createBoostedPost();
  });

  Then('I can create a valid newsfeed boost', () => {
    I.selectOption(boostPage.paymentSelector, 'offchain');
    I.seeElement(boostPage.boostPostButton);
    I.clearField(boostPage.boostViewsInput);
    I.fillField(boostPage.boostViewsInput, 0);
    I.seeElement(boostPage.boostPostButtonDisabled);
    I.seeElement(boostPage.amountInputError);
    I.clearField(boostPage.boostViewsInput);
    I.fillField(boostPage.boostViewsInput, 1000);
    I.seeElement(boostPage.boostPostButton);
    I.click(boostPage.boostPostButton);
    I.waitForElement(
      locate('p').withText('Success! Your boost request is being processed.'),
      5
    );
    I.seeElement(
      locate('p').withText('Success! Your boost request is being processed.')
    );
  });

  Then('I can revoke a boost', () => {
    boostPage.revokeBoost();
  });

  After(() => {});
}
