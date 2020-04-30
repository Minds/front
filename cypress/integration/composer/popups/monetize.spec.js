context('Composer Monetize Popup', () => {
  const showComposer = () => {
    const composerTrigger = 'm-composer .m-composer__trigger';

    cy.overrideFeatureFlags({ 'activity-composer': true });

    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(composerToolbar).should('be.visible');
  };

  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });

    showComposer();
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  // Elements

  const composer = 'm-composer__modal > m-composer__base';

  const composerToolbar = `${composer} .m-composer__toolbar`;

  const monetizeButton = `${composerToolbar} a[data-cy="monetize-button"]`;

  const monetizePopup = `${composer} m-composer__popup .m-composer__monetize`;

  const monetizeEnablePaywall = `${monetizePopup} [data-cy="monetize-enable-paywall"]`;

  const monetizePaywallAmount = `${monetizePopup} [data-cy="monetize-paywall-amount"]`;

  const monetizeSaveButton = `${monetizePopup} [data-cy="monetize-save-button"]`;

  //

  it('should show and be able to interact with the NSFW popup', () => {
    cy.get(monetizeButton).click();

    cy.get(monetizePopup).should('be.visible');

    cy.get(monetizeSaveButton).click();

    cy.get(monetizePopup).should('not.be.visible');

    cy.get(monetizeButton).click();

    cy.get(monetizeSaveButton).should('not.have.class', 'm-button--disabled');

    cy.get(monetizeEnablePaywall).click();

    cy.get(monetizePaywallAmount)
      .focus()
      .clear()
      .type('0');

    cy.get(monetizeSaveButton).should('have.class', 'm-button--disabled');

    cy.get(monetizePaywallAmount)
      .focus()
      .clear()
      .type('0.1');

    cy.get(monetizeSaveButton).should('not.have.class', 'm-button--disabled');

    cy.get(monetizeEnablePaywall).click();

    cy.get(monetizeSaveButton).click();
  });
});
