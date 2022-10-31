namespace PaymentsSteps {
  const { I, settingsPage } = inject();

  Given('I am on the Payment Methods page', () => {
    I.amOnPage('/settings/payments/payment-methods');
  });

  //

  When('I click Add a new card', () => {
    I.click('.m-settingsV2__paymentMethods__add a');
  });

  //

  Then('I should be redirected to stripe', () => {
    I.switchToNextTab(1);
    I.seeInCurrentUrl('checkout.stripe.com');
  });
}
