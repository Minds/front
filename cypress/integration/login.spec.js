context('Login', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/')
  })

  it('should login', () => {
    cy.get('.m-v2-topbar__Container__LoginWrapper > a').click();

    cy.location('pathname').should('eq', '/login');

    // it should have a login form

    cy.get('.m-login').should('be.visible');

    cy.get('minds-form-login .m-login-box .mdl-cell:first-child input').type(Cypress.env().username);
    cy.get('minds-form-login .m-login-box .mdl-cell:last-child input').type(Cypress.env().password);

    cy.get('minds-form-login .m-btn--login').click();

    cy.location('pathname')
      .should('eq', '/newsfeed/subscriptions');
  })

  it('should fail to login because of incorrect password', () => {
    cy.get('.m-v2-topbar__Container__LoginWrapper > a').click();

    cy.location('pathname').should('eq', '/login');

    // it should have a login form

    cy.get('.m-login').should('be.visible');

    cy.get('minds-form-login .m-login-box .mdl-cell:first-child input').type(Cypress.env().username);
    cy.get('minds-form-login .m-login-box .mdl-cell:last-child input').type(Cypress.env().password + '1');

    cy.get('minds-form-login .m-btn--login').click();

    cy.wait(500);

    cy.get('minds-form-login .m-error-box .mdl-card__supporting-text').contains('Incorrect username/password. Please try again.');
    // cy.location('pathname').should('eq', '/newsfeed/subscriptions');
  })
})
