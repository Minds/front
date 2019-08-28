context('Boost Impressions', () => {
  
  beforeEach(() => {
    cy.login(true);

    cy.location('pathname', { timeout: 30000 })
      .should('eq', '/newsfeed/subscriptions');
  });

  it('should register views on scroll', () => {
    //stub endpoint
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/activity/*").as("analytics");
    
    //load, scroll, wait to trigger analytics
    cy.wait(3000);
    cy.scrollTo(0, 500);
    cy.wait(3000);
    
    //assert
    cy.wait('@analytics', { requestTimeout: 5000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });
  });

  it('should register views on boost rotate forward', () => {
    //stub endpoint
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/boost/*").as("analytics");
    cy.wait(3000);

    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator > div > ul > li:nth-child(2) > i')
      .click();
    cy.wait(3000);
    
    //assert
    cy.wait('@analytics', { requestTimeout: 5000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });
  });

  it('should register views on boost rotate backward', () => {
    //stub endpoint
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/boost/*").as("analytics");
    cy.wait(3000);

    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator > div > ul > li:nth-child(1) > i')
      .click();
    cy.wait(3000);
    
    //assert
    cy.wait('@analytics', { requestTimeout: 5000 }).then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });
  });
});
