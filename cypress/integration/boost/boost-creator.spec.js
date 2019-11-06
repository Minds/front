/**
 * @author Ben Hayward
 * @desc E2E testing for Minds Boost Console pages.
 */
import generateRandomId from '../../support/utilities';

context('Boost Console', () => {
  const postContent = "Test boost, please reject..." + generateRandomId();

  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    newBoost(postContent, 500);
  });

  beforeEach(() => {
    cy.server();
    cy.route("POST", '**/api/v2/boost/**').as('boostPost');
    cy.preserveCookies();
    cy.visit('/boost/console/newsfeed/history');  
  });
  
  after(() => {
    cy.clearCookies();
  });

  it('should show a new boost in the console', () => {
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    cy.get('m-boost-console-card:nth-child(1) .m-mature-message span')
      .contains(postContent);
  });

  it('should allow a revoke a boost', () => {
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    
    cy.get('m-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button')
      .click();
    
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .contains('revoked');
  });

  it('should load show the user content for newsfeed boosts', () => {
    cy.route("GET", "**/feeds/container/*/activities**").as("activities");
    cy.contains('Create a Boost')
      .click()
      .location('pathname')
      .should('eq', `/boost/console/newsfeed/create`)
      .wait('@activities').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load show the user content for sidebar boosts', () => {
    cy.route("GET", "**/api/v2/feeds/container/*/all**").as("all");
    cy.visit('/boost/console/content/create')
      .location('pathname')
      .should('eq', `/boost/console/content/create`)
      .wait('@all').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  it('should load show the user content for offers', () => {
    cy.route("GET", "**/api/v2/feeds/container/*/activities**").as("all");
    cy.visit('/boost/console/offers/create')
      .location('pathname')
      .should('eq', `/boost/console/offers/create`)
      .wait('@all').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  })

  function newBoost(text, views) {
    cy.server();
    cy.route("POST", '**/api/v2/boost/**').as('boostPost');

    cy.visit('/newsfeed/subscribed');
    cy.post(text);

    cy.get('#boost-actions')
      .first()
      .click();

    cy.get('.m-boost--creator-section-amount input')
      .type(views);

    cy.get('m-overlay-modal > div.m-overlay-modal > m-boost--creator button')
      .click();

    cy.wait('@boostPost').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });

    cy.get('.m-overlay-modal')
      .should('not.be.visible')
  }

})
