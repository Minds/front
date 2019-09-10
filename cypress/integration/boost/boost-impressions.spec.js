context('Boost Impressions', () => {
  
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.visit('/newsfeed/subscriptions');  
    cy.location('pathname')
      .should('eq', `/newsfeed/subscriptions`);
  });

  beforeEach(()=> {
    cy.preserveCookies();
  });

  it('should register views on scroll', () => {
    //stub endpoint
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/activity/*").as("analytics");
    
    //load, scroll, wait to trigger analytics
    cy.scrollTo(0, 500);
    
    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body).to.deep.equal({ status: 'success' });
    });
  });

  it('should register views on boost rotate', () => {
    //stub endpoint
    cy.server();
    cy.route("POST", "**/api/v2/analytics/views/boost/*").as("analytics");

    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator > div > ul > li:nth-child(3) > i')
      .click();
    
    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });

    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator > div > ul > li:nth-child(2) > i')
      .click();
    
    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });
  });
});
