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
    cy.overrideFeatureFlags({
      navigation: true,
    });
    cy.reload();

    cy.server();
    cy.route('GET', '**/api/v3/discovery/tags*').as('getTags');
    cy.route('POST', '**/api/v3/discovery/tags').as('postTags');

    cy.visit('/discovery/tags');
  });

  const discoverySettingsButton =
    '[data-cy="discover-by-tags-settings-button"]';

  const openSettingsModal = () => {
    cy.get(discoverySettingsButton)
      .should('be.visible')
      .click();

    // Wait for the tags to load
    return cy.wait('@getTags').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.equal('success');

      return xhr.response.body;
    });
  };

  it('should navigate to discovery by tags', () => {
    cy.visit('/discovery');

    cy.get('[data-cy="discovery-tab-link-tags"]')
      .should('be.visible')
      .click();

    cy.url().should('include', 'discovery/tags');
  });

  it('should open settings modal', () => {
    openSettingsModal();

    cy.get('.m-modalV2__wrapper').should('be.visible');
  });

  it('should select a tag', () => {
    openSettingsModal().then(({ tags, trending }) => {
      const firstTag = cy.get(
        '[data-cy="discovery-settings-section--other"] > ul > li:first-of-type'
      );

      // first hover over
      firstTag.trigger('mouseover');
      // then click
      firstTag
        .find('[data-cy="discovery-settings-add-button"]')
        .click({ force: true });

      cy.get(
        `[data-cy="discovery-settings-section--selected"] > ul > li`
      ).should('have.length', tags.length + 1);

      cy.get(`[data-cy="discovery-settings-section--other"] > ul > li`).should(
        'have.length',
        trending.length - 1
      );

      cy.get(`[data-cy="discovery-settings-save-button"]`).click();

      cy.wait('@postTags').then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

      cy.get('.m-modalV2__wrapper').should('not.visible');

      // Original list should have the same count too
      cy.get(`[data-cy="discovery-tags-section--user"] > li`).should(
        'have.length',
        tags.length + 1
      );
    });
  });

  it('should remove a tag', () => {
    openSettingsModal().then(({ tags, trending }) => {
      const firstTag = cy.get(
        '[data-cy="discovery-settings-section--selected"] > ul > li:first-of-type'
      );

      // first hover over
      firstTag.trigger('mouseover');
      // then click
      firstTag
        .find('[data-cy="discovery-settings-remove-button"]')
        .click({ force: true });

      // cy.get(`[data-cy="discovery-settings-section--selected"] > ul > li`).should(
      //   'have.length',
      //   tags.length - 1
      // );

      cy.get(`[data-cy="discovery-settings-save-button"]`).click();

      cy.wait('@postTags').then(xhr => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.equal('success');
      });

      cy.get('.m-modalV2__wrapper').should('not.visible');

      // Original list should have the same count too
      cy.get(`[data-cy="discovery-tags-section--user"] > li`).should(
        'have.length',
        tags.length - 1
      );
    });
  });

  it('should add a manual tag', () => {
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
