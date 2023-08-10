namespace ConfirmationModalSteps {
  const { confirmationModalComponent } = inject();

  When('I click to accept the confirmation modal', () => {
    confirmationModalComponent.clickConfirm();
  });
}
