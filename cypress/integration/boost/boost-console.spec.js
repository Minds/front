context('Boost Console', () => {
  const postContent = "Test boost, please reject..." + Math.random().toString(36);

  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    
  });

  beforeEach(() => {
    cy.preserveCookies();
    cy.visit('/newsfeed/subscribed');
    newBoost(postContent, 100);
  });
  
  it('should show a new boost in the console', () => {
    cy.visit('/boost/console/newsfeed/history');  
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    cy.get('m-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button')
      .click();
    cy.get('m-boost-console-card:nth-child(1) .m-mature-message span')
      .contains(postContent);
  });

  it('should allow a revoke a boost', () => {
    navToConsole();
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    
    cy.get('m-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button')
      .click();
    
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .contains('revoked');
  });

  function navToConsole() {
    cy.visit('/boost/console/newsfeed/history');  
    cy.location('pathname')
      .should('eq', `/boost/console/newsfeed/history`);
  }

  function newBoost(text, views) {
    cy.server();
    cy.route("POST", '**/api/v2/boost/**').as('boostPost');
    cy.post(text);

    cy.get('#boost-actions')
      .first()
      .click();

    cy.get('.m-boost--creator-section-amount input')
      .type(views);

    cy.get('m-overlay-modal > div.m-overlay-modal > m-boost--creator button')
      .click();

    cy.wait('@boostPost').then((xhr) => {
      cy.log(xhr);
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });

    cy.get('.m-overlay-modal')
      .should('not.be.visible')
  }

})
