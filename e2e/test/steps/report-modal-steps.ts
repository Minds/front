namespace ReportModalSteps {
  const { reportModalComponent } = inject();

  Given(
    'I select the report modal option with text {string}',
    (optionText: string) => {
      reportModalComponent.selectOptionWithText(optionText);
    }
  );

  Given('I click report modal next button', () => {
    reportModalComponent.clickNextButton();
  });

  When('I click report modal the submit button', () => {
    reportModalComponent.clickSubmitButton();
  });

  Then('I should see the report modal success panel', () => {
    reportModalComponent.isSuccessPanelVisible();
  });
}
