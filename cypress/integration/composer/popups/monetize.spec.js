context('Composer Monetize Popup', () => {

  // Elements
  const composer = 'm-composer__modal > m-composer__base';
  const composerToolbar = `${composer} .m-composer__toolbar`;
  const monetizeButton = `${composerToolbar} a[data-cy=monetize-button]`;
  const monetizePopup = `m-composer__popup .m-composer__monetize`;
  const monetizeEnablePaywall = `[data-cy=monetize-membership-enable-paywall-checkbox]`;
  const monetizeSaveButton = `[data-cy=monetize-save-button]`;
  const monetizeCustomTab = `[data-cy=monetize-membership-custom-tab]`;
  const monetizePaywallAmount = `[data-cy=monetize-membership-paywall-amount-input]`

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

  it('should show and be able to interact with the NSFW popup', () => {
    cy.get(monetizeButton).click();

    cy.get(monetizePopup).should('be.visible');

    cy.get(monetizeSaveButton).click();

    cy.get(monetizePopup).should('not.be.visible');

    cy.get(monetizeButton).click();

    cy.get(monetizeSaveButton).should('not.have.class', 'm-button--disabled');

    cy.get(monetizeCustomTab).click();

    cy.get(monetizeEnablePaywall).click();

    cy.get(monetizePaywallAmount)
      .focus()
      .clear()
      .type('0');

    cy.contains('Save').should('be.disabled');

    cy.get(monetizePaywallAmount)
      .focus()
      .clear()
      .type('1');

    cy.contains('Save')
      .should('not.be.disabled')
      .click();
  });

  const showComposer = () => {
    const composerTrigger = 'm-composer .m-composer__trigger';

    cy.overrideFeatureFlags({ 'activity-composer': true });

    cy.visit('/newsfeed/subscriptions');

    cy.get(composerTrigger)
      .should('be.visible')
      .click();

    cy.get(composerToolbar).should('be.visible');
  };

});
