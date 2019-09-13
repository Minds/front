context('Boost Creation', () => {
  const duplicateError = "There's already an ongoing boost for this entity";
  const postContent = "Test boost, please reject..." + Math.random().toString(36).substring(8);
  const nonParticipationError = 'Boost target should participate in the Rewards program.'

  before(() => {
    cy.server();
  })
  
  beforeEach(() => {
    cy.getCookie('minds_sess')
    .then((sessionCookie) => {
      if (sessionCookie === null) {
        return cy.login(true);
      }
    });
    cy.visit('/newsfeed/subscriptions');  
    cy.location('pathname')
      .should('eq', `/newsfeed/subscriptions`);

    cy.route("GET", '**/api/v2/boost/prepare/**').as('prepare');
    cy.route("POST", '**/api/v2/boost/activity/**').as('activity');  
    cy.route("GET", '**/api/v2/blockchain/wallet/balance*').as('balance');
    cy.route("GET", '**/api/v2/search/suggest/**').as('suggest');

  });

  it('should redirect a user to buy tokens when clicked', () => {    
    openTopModal();

    cy.get('m-boost--creator-payment-methods li h5 span')
      .contains('Buy Tokens')
      .click();

    cy.location('pathname', { timeout: 30000 })
      .should('eq', `/token`);
  });

  it('should allow a user to make an offchain boost for 5000 tokens', () => {    
    cy.post(postContent);

    openTopModal();
  
    cy.get('.m-boost--creator-section-amount input')
      .type(5000);
  
    cy.get('m-overlay-modal > div.m-overlay-modal > m-boost--creator button')
      .click()
      .wait('@prepare').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("success");
      }).wait('@activity').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("success");
      });
        
    cy.get('.m-overlay-modal')
      .should('not.be.visible')
  });

  it('should error if the boost is a duplicate', () => {
    openTopModal();  
    cy.get('.m-boost--creator-section-amount input')
      .type(5000);

    cy.get('m-overlay-modal > div.m-overlay-modal > m-boost--creator button')
      .click()
      .wait('@prepare').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("success");
      }).wait('@activity').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("error");
      });
    
    cy.get('[data-cy=data-minds-boost-creation-error]')
      .contains(duplicateError);
  });

  it('should display an error if boost offer receiver has not signed up for rewards', () => {
    openTopModal();

    cy.get('h4')
      .contains('Offers')
      .click();
    
    cy.get('m-boost--creator-p2p-search .m-boost--creator-wide-input input')
      .type("minds").wait('@suggest').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("success");
      });
    
    cy.get('.m-boost--creator-autocomplete--results .m-boost--creator-autocomplete--result-content')
      .first()
      .click({force: true});

    cy.get('[data-cy=data-minds-boost-creation-error]')
      .contains(nonParticipationError);
  });

  function openTopModal() {
    cy.get('#boost-actions')
      .first()
      .click()
      .wait('@balance').then((xhr) => {
        expect(xhr.status).to.equal(200);
        expect(xhr.response.body.status).to.deep.equal("success");
      });
  }

})
