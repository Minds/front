context('Composer NSFW Popup', () => {
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

  const nsfwButton = `${composerToolbar} a[data-cy="nsfw-button"]`;

  const nsfwPopup = `${composer} m-composer__popup .m-composer__nsfw`;

  const nsfwSaveButton = `${nsfwPopup} [data-cy="nsfw-save-button"]`;

  //

  it('should show and be able to interact with the NSFW popup', () => {
    cy.get(nsfwButton).click();

    cy.get(nsfwPopup).should('be.visible');

    cy.get(nsfwSaveButton).click();

    cy.get(nsfwButton).click();

    cy.get(`${nsfwPopup} .m-composerNsfw__list .m-composerNsfw__item:eq(1)`)
      .click()
      .should('have.class', 'm-composerNsfw__item--active');

    cy.get(`${nsfwPopup} .m-composerNsfw__list .m-composerNsfw__item:eq(3)`)
      .click()
      .should('have.class', 'm-composerNsfw__item--active');

    cy.get(nsfwSaveButton).click();

    cy.get(nsfwButton).click();

    cy.get(nsfwPopup).should('be.visible');

    cy.get(`${nsfwPopup} .m-composerNsfw__list .m-composerNsfw__item:eq(1)`)
      .should('have.class', 'm-composerNsfw__item--active')
      .click()
      .should('not.have.class', 'm-composerNsfw__item--active');

    cy.get(
      `${nsfwPopup} .m-composerNsfw__list .m-composerNsfw__item:eq(3)`
    ).should('have.class', 'm-composerNsfw__item--active');

    cy.get(nsfwSaveButton).click();
  });
});
