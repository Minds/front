namespace ActivityModalSteps {
  const { activityModalComponent } = inject();

  Then('I should see the activity modal', () => {
    activityModalComponent.shouldBeVisible();
  });
}
