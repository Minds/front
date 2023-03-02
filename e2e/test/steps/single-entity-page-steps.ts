namespace SingleEntityPageSteps {
  const { I, singleEntityPage } = inject();

  When(
    'I navigate to a single entity page whose url contains a query param for opening the boost modal after a delay',
    (): void => {
      // Go to an existing post SEP
      const existingActivityGuid = '1477879137912754189';

      // NOTE: this hardcoded guid is an extremely hacky workaround
      I.amOnPage(`/newsfeed/${existingActivityGuid}?boostModalDelayMs=1000`);
    }
  );

  //

  Then('I wait for the boost modal to appear', () => {
    singleEntityPage.waitForBoostModal(2000);
  });
}
