context('Discovery -> Discover by tags', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();

    cy.server();
    cy.route('GET', '**/api/v2/hashtags/suggested**').as('getTags');
    cy.route('POST', '**/api/v3/discovery/tags').as('postTags');
  });

  const discoverySettingsButton =
    '[data-cy="discover-by-tags-settings-button"]';

  const openSettingsModal = () => {
    cy.get(discoverySettingsButton)
      .should('be.visible')
      .click();
    return;
    
    // Wait for the tags to load
    return cy.wait('@getTags').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');

      return xhr.response.body;
    });
  };

  it('should navigate to discovery by tags', () => {
    cy.get('m-sidebar--navigation')
      .contains('Discovery')
      .click()
      .location('href')
      .should('contain', '/discovery/overview');
  });

  it('should open modal and select a tag', () => {
    openSettingsModal()
    cy.get('.m-modalV2__wrapper').should('be.visible');

    const firstTag = cy.get(
      '[data-cy="discovery-settings-section--other"] > ul > li:first-of-type'
    );

    // first hover over
    firstTag.trigger('mouseover');
    // then click
    firstTag
      .find('[data-cy="discovery-settings-add-button"]')
      .click({ force: true });

    cy.get(`[data-cy="discovery-settings-save-button"]`).click();

    cy.wait('@postTags').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    });

    cy.get('.m-modalV2__wrapper').should('not.visible');
  });

  it('should remove a tag', () => {
    openSettingsModal()
    const firstTag = cy.get(
      '[data-cy="discovery-settings-section--selected"] > ul > li:first-of-type'
    );

    // first hover over
    firstTag.trigger('mouseover');
    // then click
    firstTag
      .find('[data-cy="discovery-settings-remove-button"]')
      .click({ force: true });

    cy.get(`[data-cy="discovery-settings-save-button"]`).click();

    cy.wait('@postTags').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');
    });

    cy.get('.m-modalV2__wrapper').should('not.visible');
  });

  it.skip('should add a manual tag', () => {
    openSettingsModal().then(({ tags, trending }) => {
      // Wait until lenght is resolved
      cy.get(
        `[data-cy="discovery-settings-section--selected"] > ul > li`
      ).should('have.length', tags.length);

      const time = Date.now();
      cy.get('[data-cy="discovery-settings-input"]').type(
        `tmptag${time}{enter}`
      );

      cy.get(
        `[data-cy="discovery-settings-section--selected"] > ul > li`
      ).should('have.length', tags.length + 1);

      cy.reload();
    });
  });
});
