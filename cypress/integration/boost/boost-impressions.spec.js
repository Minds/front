// Cannot test until env behaves consistently else, 
// the test will frequently error when it cant see a boost.
context.skip('Boost Impressions', () => {
  before(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
  });

  beforeEach(()=> {
    cy.server();
    cy.route("POST", "**api/v2/analytics/views/boost/*").as("analytics");
    cy.route("GET", "**/api/v2/feeds/subscribed/activities**").as("activities");

    cy.preserveCookies();
    cy.visit('/newsfeed/subscriptions')
      .location('pathname')
      .should('eq', `/newsfeed/subscriptions`)
      .wait('@activities').then((xhr) => {
        expect(xhr.status).to.equal(200);
      });
  });

  afterEach(()=> {
    cy.reload();
  })

  it('should register views on scroll', () => {
    //smooth scroll
    cy.scrollTo('0', '1%', { duration: 100 });

    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
    });
  });

  it('should register views on boost rotate', () => {
    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator')
      .find('chevron_right')
      .click();
    
    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });

    //rotate forward and wait to trigger analytics
    cy.get('m-newsfeed--boost-rotator')
      .find('chevron_left')
      .click();
    
    //assert
    cy.wait('@analytics').then((xhr) => {
      expect(xhr.status).to.equal(200);
      expect(xhr.response.body.status).to.deep.equal("success");
    });
  });
});
