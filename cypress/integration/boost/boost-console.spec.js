/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Boost Console pages.
 */
import generateRandomId from '../../support/utilities';

context('Boost Console', () => {
  const postContent = 'Test boost, please reject...' + generateRandomId();

  before(() => {
    // This test makes use of cy.post()
    cy.overrideFeatureFlags({ 'activity-composer': true });

    cy.getCookie('minds_sess').then(sessionCookie => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });

    newBoost(postContent, 500);
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.server();
    cy.route('POST', '**/api/v2/boost/**').as('boostPost');
    cy.get('.m-dropdown .minds-avatar').click();
    cy.contains('Boost Console').click();
  });

  it('should show a new boost in the console', () => {
    cy.get(
      'm-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state'
    ).should('not.contain', 'revoked');
    cy.get('m-boost-console-card:nth-child(1) span').contains(
      postContent
    );
  });

  it('should allow a revoke a boost', () => {
    cy.get(
      'm-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state'
    ).should('not.contain', 'revoked');

    // cy.get(
    //   'm-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button'
    // ).click();

    cy.contains('Revoke').first().click();
    cy.get(
      'm-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state'
    ).contains('revoked');
  });

  it('should load show the user content for newsfeed boosts', () => {
    cy.route('GET', '**/feeds/container/*/activities**').as('activities');
    cy.contains('Create a Boost')
      .click()
      .location('pathname')
      .should('eq', `/boost/console/newsfeed/create`)
      .wait('@activities')
      .then(xhr => {
        expect(xhr.status).to.equal(200);
      });
  });

  it('should load show the user content for sidebar boosts', () => {
    // cy.visit('/boost/console/content/create');

    cy.contains('Sidebar').click();

    cy.contains('Create a Boost')
      .click()
      .location('pathname')
      .should('eq', `/boost/console/content/create`);

    // TODO: Fix this to wait on response. Currently SSR fires before the wait command.
    // .wait('@all').then((xhr) => {
    //     expect(xhr.status).to.equal(200);
    //   })
  });

  it('should load show the user content for offers', () => {
    // cy.visit('/boost/console/content/create');

    cy.contains('Offers').click();

    cy.contains('Create a Boost')
      .click()
      .location('pathname')
      .should('eq', `/boost/console/offers/create`);
    // .wait('@all').then((xhr) => {
    //   expect(xhr.status).to.equal(200);
    // });
  });

  function newBoost(text, views) {
    cy.server();
    cy.route('POST', '**/api/v2/boost/**').as('boostPost');

    cy.post(text);

    cy.get('.m-boostButton')
      .first()
      .click();

    cy.get('.m-boost--creator-section-amount input').type(views);

    cy.get(
      '.m-boost--creator-button--submit'
    ).click();

    cy.wait('@boostPost').then(xhr => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal('success');
    });

    cy.get('.m-overlay-modal').should('not.be.visible');
  }
});
