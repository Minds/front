namespace SingleEntityPageSteps {
  const { I, singleEntityPage } = inject();

  When(
    'I navigate to a single entity page whose url contains a query param for opening the boost modal after a delay',
    (): void => {
      // NOTE: this hardcoded guid is an extremely hacky workaround
      const existingActivityGuid =
        process.env.PLAYWRIGHT_EXISTING_ACTIVITY_GUID ?? '1477879137912754189';

      // Go to an existing post SEP
      I.amOnPage(`/newsfeed/${existingActivityGuid}?boostModalDelayMs=1000`);
    }
  );

  //

  Then('I wait for the boost modal to appear', () => {
    singleEntityPage.waitForBoostModal(2000);
  });
}
