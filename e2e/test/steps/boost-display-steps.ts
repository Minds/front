namespace BoostDisplaySteps {
  const { boostRotatorComponent } = inject();

  When('I remind the boost featured in the boost rotator', async () => {
    boostRotatorComponent.waitForBoostFeedRotator(true);
    boostRotatorComponent.shouldSeeBoostRotator(true);
    await boostRotatorComponent.toggleRemind();
  });

  When('I click to quote the boost featured in the boost rotator', async () => {
    boostRotatorComponent.waitForBoostFeedRotator(true);
    boostRotatorComponent.shouldSeeBoostRotator(true);
    await boostRotatorComponent.openComposerForQuote();
  });

  When('I click to open the boost rotator settings', () => {
    boostRotatorComponent.waitForBoostFeedRotator(true);
    boostRotatorComponent.shouldSeeBoostRotator(true);
    boostRotatorComponent.clickBoostSettingsButton();
  });

  Then('I should see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator(true);
    boostRotatorComponent.shouldSeeBoostRotator(true);
  });

  Then('I should not see the boost rotator', () => {
    boostRotatorComponent.waitForBoostFeedRotator();
    boostRotatorComponent.shouldSeeBoostRotator(false);
  });
}
