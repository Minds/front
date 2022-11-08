namespace SupermindSettingsSteps {
  const { I, supermindSettingsPage } = inject();

  // randomized amounts for testing to allow checking in subsequent steps.
  const randomisedMinOffchainTokenAmount = Math.floor(
    20 + Math.random() * (100 - 20 + 1)
  ).toString();

  const randomisedMinCashAmount = Math.floor(
    20 + Math.random() * (100 - 20 + 1)
  ).toString();

  // preset invalid amounts to allow checking in subsequent steps.
  const invalidMinOffchainTokenAmount = '1.234';
  const invalidMinCashAmount = '1';

  Before(() => {});

  Given('I am on the Supermind settings page', async () => {
    await supermindSettingsPage.navigateToViaSupermindConsole();
  });

  Given('I fill out random Supermind settings values', () => {
    supermindSettingsPage.inputMinOffchainTokens(
      randomisedMinOffchainTokenAmount
    );
    supermindSettingsPage.inputMinCash(randomisedMinCashAmount);
  });

  Given('I fill out invalid Supermind settings values', () => {
    supermindSettingsPage.inputMinOffchainTokens(invalidMinOffchainTokenAmount);
    supermindSettingsPage.inputMinCash(invalidMinCashAmount);
  });

  When('I submit the Supermind settings form', () => {
    supermindSettingsPage.clickSubmitButton();
  });

  Then('I should see that on refresh my settings persisted', () => {
    I.refreshPage();
    supermindSettingsPage.checkFormValues('min_cash', randomisedMinCashAmount);
    supermindSettingsPage.checkFormValues(
      'min_offchain_tokens',
      randomisedMinOffchainTokenAmount
    );
  });

  Then('I should see a disabled Supermind submit button', () => {
    supermindSettingsPage.checkSubmitButtonDisabled();
  });

  Then('I should see Supermind form validation errors', () => {
    supermindSettingsPage.checkValidationErrorHasText(
      supermindSettingsPage.validationErrorText.min_cash
    );
    supermindSettingsPage.checkValidationErrorHasText(
      supermindSettingsPage.validationErrorText.two_decimal_places
    );
  });
}
