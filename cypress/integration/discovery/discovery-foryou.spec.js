context('Discovery -> for you', () => {
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
    cy.route(
      'GET',
      '**/api/v3/discovery/trends*',
      {
        status: 'error',
        errorId: 'Minds::Core::Discovery::NoTagsException',
      },
      { status: 400 }
    ).as('getEmptyTrends');
    cy.route('POST', '**/api/v3/discovery/tags').as('postTags');

    cy.visit('/discovery/overview');
  });

  after(() => {
    cy.overrideFeatureFlags({
      navigation: false,
    });
  });

  const discoverySettingsButton =
    '[data-cy="discover-by-tags-settings-button"]';

  // const openSettingsModal = () => {
  //   cy.get(discoverySettingsButton)
  //     .should('be.visible')
  //     .click();

  //   // Wait for the tags to load
  //   return cy.wait('@getTags').then(xhr => {
  //     expect(xhr.status).to.equal(200);
  //     expect(xhr.response.body.status).to.equal('success');

  //     return xhr.response.body;
  //   });
  // };

  // NOTE: This is not e2e, just integration test
  it('should show tags prompt if no tags ', () => {
    cy.visit('/discovery/tags');

    cy.get('[data-cy="discovery-tab-link-overview"]')
      .should('be.visible')
      .click();

    cy.url().should('include', 'discovery/overview');
  });

  // NOTE: This is not **full** e2e, just integration test
  it('should open settings modal', () => {
    cy.wait('@getEmptyTrends');

    cy.get('[data-cy="discovery-notags-select-tags-button"]')
      .should('be.visible')
      .click();
    //openSettingsModal();

    cy.get('.m-modalV2__wrapper').should('be.visible');

    cy.get('[data-cy=discovery-settings-save-button]')
      .should('be.visible')
      .click();

    cy.route('GET', '**/api/v3/discovery/trends*', {
      status: 'success',
      trends: [
        {
          period: 12,
          volume: 200,
          entity: {},
        },
      ],
    }).as('getStubbedTrends');

    cy.wait('@getStubbedTrends');

    cy.get('.m-discovery__trends').should('be.visible');
  });
});
