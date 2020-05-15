context('Composer Title Bar', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.overrideFeatureFlags({ 'activity-composer': true });

    cy.preserveCookies();
  });

  // Components

  const composer = 'm-composer__modal > m-composer__base';

  const composerTitleBar = `${composer} .m-composer__titleBar`;

  const composerTextarea = `${composer} [data-cy="composer-textarea"]`;

  const titleLabel = `${composerTitleBar} .m-composerTitleBar__title label`;

  const meatballMenuTrigger = `${composerTitleBar} [data-cy="meatball-menu-trigger"]`;

  const meatballMenu = `${composerTitleBar} [data-cy="meatball-menu"]`;

  const meatballMenuVisibility = `${composerTitleBar} [data-cy="meatball-menu-visibility"]`;

  const meatballMenuLicense = `${composerTitleBar} [data-cy="meatball-menu-license"]`;

  const meatballMenuVisibilityMenu = `${composerTitleBar} [data-cy="meatball-menu-visibility-menu"]`;

  const meatballMenuLicenseMenu = `${composerTitleBar} [data-cy="meatball-menu-license-menu"]`;

  //

  context('Modal', () => {
    before(() => {
      const composerTrigger = 'm-composer .m-composer__trigger';

      cy.overrideFeatureFlags({ 'activity-composer': true });

      cy.visit('/newsfeed/subscriptions');

      cy.get(composerTrigger)
        .should('be.visible')
        .click();

      cy.get(composerTitleBar).should('be.visible');
    });

    it('should focus textarea when clicking title', () => {
      cy.get(titleLabel).click();

      cy.get(composerTextarea).should('have.focus');
    });

    it('should open a dropdown when clicking meatball menu', () => {
      cy.get(meatballMenuTrigger).click();

      cy.get(meatballMenu).should('be.visible');

      cy.get(meatballMenuVisibility).click();

      cy.get(meatballMenuVisibilityMenu).should('be.visible');

      cy.get(`${meatballMenuVisibility} m-overlay`).click();

      cy.get(meatballMenuLicense).click();

      cy.get(meatballMenuLicenseMenu).should('be.visible');

      cy.get(`${meatballMenuLicense} m-overlay`).click({force: true});

      cy.get(`${meatballMenuTrigger} m-overlay`).click();

      cy.get(meatballMenuTrigger).should('be.visible');
    });
  });
});
