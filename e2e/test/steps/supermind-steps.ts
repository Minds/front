namespace SupermindSteps {
  const {
    I,
    composerModalComponent,
    supermindOnboardingModalComponent,
    channelPage,
  } = inject();

  When('I click the supermind icon on the composer toolbar', () => {
    composerModalComponent.clickSupermindIcon();
  });

  When('I enter a target username with value {string}', targetUsername => {
    composerModalComponent.addSupermindTarget(targetUsername);
  });

  When('I accept the supermind terms', () => {
    composerModalComponent.acceptSupermindTerms();
  });

  When('I accept the refund policy', () => {
    composerModalComponent.acceptSupermindRefundPolicy();
  });

  When('I click the supermind creator save button', () => {
    composerModalComponent.clickSupermindSave();
  });

  When('I click the supermind creator clear button', () => {
    I.waitForElement(locate('button').withText('Clear'));
    I.click(locate('button').withText('Clear'));
  });

  When('I click on the channel supermind button', () => {
    I.waitForElement(channelPage.supermindButton, 5);
    I.click(channelPage.supermindButton);
  });

  When('I click the activity post supermind icon on the toolbar', () => {
    I.waitForElement('[data-ref=activity-icon-supermind-action] m-button', 10);
    I.click('[data-ref=activity-icon-supermind-action] m-button');
  });

  When('I see the supermind request onboarding modal', () => {
    supermindOnboardingModalComponent.requestModalShouldBeVisible(true);
  });

  When('I see the supermind request onboarding modal', () => {
    supermindOnboardingModalComponent.requestModalShouldBeVisible(true);
  });

  When('I click the action button in the Supermind onboarding modal', () => {
    supermindOnboardingModalComponent.clickContinue();
  });

  //

  Then('I should see the supermind request onboarding modal', num => {
    supermindOnboardingModalComponent.requestModalShouldBeVisible(true);
  });

  Then('I should see the supermind reply onboarding modal', num => {
    supermindOnboardingModalComponent.replyModalShouldBeVisible(true);
  });

  Then('I should see the supermind popout screen', num => {
    I.seeElement(composerModalComponent.getSupermindPopup());
  });

  Then('I see the supermind is in progress', () => {
    I.seeElement(
      '[data-ref=supermind-create--button].m-composerToolbar__item--active'
    );
  });

  Then('I should not see the supermind is in progress', () => {
    I.dontSeeElement(
      '[data-ref=supermind-create--button].m-composerToolbar__item--active'
    );
  });

  Then('I should not see the supermind icon on the composer toolbar', () => {
    composerModalComponent.shouldHaveSupermindToolbarIcon(false);
  });

  Then('I should see prefilled supermind details in the composer', () => {
    I.waitForElement(composerModalComponent.modalElementTag, 5);
    I.seeElement(composerModalComponent.getSupermindPopup());
    I.waitForElement(composerModalComponent.composerCloseButton);
    I.click(composerModalComponent.composerCloseButton);
    I.pressKey('Escape');
  });

  Then(
    'I should see prefilled supermind details excluding my username as target user in the composer',
    () => {
      I.waitForElement(composerModalComponent.modalElementTag, 5);
      I.seeElement(composerModalComponent.getSupermindPopup());
      composerModalComponent.shouldHaveSupermindTargetInputText('');
      I.waitForElement(composerModalComponent.composerCloseButton);
      I.click(composerModalComponent.composerCloseButton);
      I.pressKey('Escape');
    }
  );
}
