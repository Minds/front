namespace SingleEntityPageSteps {
  const { singleEntityPage, channelPage } = inject();

  When(
    'I navigate to a single entity page whose url contains a query param for opening the boost modal after a delay of {string} ms',
    (boostModalDelayMs: string): void => {
      const delayMs = Number(boostModalDelayMs);

      // From the 'minds' channel page,
      I.amOnPage('/minds');
      channelPage.waitForContentComponent();

      // First go to SEP of first post
      const permalink = locate('[data-ref=m-activityPermalink__wrapper--link]')
        .inside('m-activity')
        .at(1);

      I.waitForElement(permalink);
      I.click(permalink);

      // Then go to that same SEP with the queryParam
      I.amOnPage(`?boostModalDelayMs=${delayMs}`);
    }
  );

  //

  Then(
    'I wait for the boost modal to appear after {string} ms',
    (boostModalDelayMs: number = 2000) => {
      singleEntityPage.waitForBoostModal(boostModalDelayMs);
    }
  );
}
