context('Boost Console', () => {
  const postContent = "Test boost, please reject..." + Math.random().toString(36);

  beforeEach(() => {
    cy.login(true); 
    cy.wait(5000);
  
    cy.visit('/newsfeed/subscriptions');  
    cy.wait(3000);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/newsfeed/subscriptions`);
    
    newBoost(postContent, 100);
  });
  
  it('should show a new boost in the console', () => {
    cy.visit('/boost/console/newsfeed/history');  
    cy.wait(3000);
  
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    
    cy.get('m-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button')
      .click();
    cy.wait(1000);

    cy.get('m-boost-console-card:nth-child(1) .m-mature-message span')
      .contains(postContent);
  });

  it('should allow a revoke a boost', () => {
    navToConsole();
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .should('not.contain', 'revoked');
    
    cy.get('m-boost-console-card:nth-child(1) .m-boost-card--manager-item--buttons > button')
      .click();
    cy.wait(1000);
    
    cy.get('m-boost-console-card:nth-child(1) div.m-boost-card--manager-item.m-boost-card--state')
      .contains('revoked');
  });

  function navToConsole() {
    cy.visit('/boost/console/newsfeed/history');  
    cy.wait(3000);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/boost/console/newsfeed/history`);

  }

  function newBoost(text, views) {
    cy.post(text);
    cy.wait(2000);

    cy.get('#boost-actions')
      .first()
      .click();
    cy.wait(5000);
    
    cy.get('.m-boost--creator-section-amount input')
      .type(views);

    cy.get('m-overlay-modal > div.m-overlay-modal > m-boost--creator button')
      .click();
    cy.wait(5000);
    
    cy.get('.m-overlay-modal')
      .should('not.be.visible')
  }

})
