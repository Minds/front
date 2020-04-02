context('Login', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.visit('/')
      .location('pathname')
      .should('eq', `/`);
  })

  it('should login', () => {
    cy.get('.m-v2-topbar__Container__LoginWrapper > a').contains('Login').click();

    cy.location('pathname').should('eq', '/login');

    // cy.get('.m-login__wrapper').should('be.visible');

    // type username and password
    cy.get('minds-form-login .m-login-box .mdl-cell:first-child input')
      .type(Cypress.env().username);
    
    cy.get('minds-form-login .m-login-box .mdl-cell:last-child input')
      .type(Cypress.env().password);

    // click login button
    cy.get('button')
      .contains('Login')
      .click();

    cy.location('pathname')
      .should('eq', '/newsfeed/subscriptions');
  })

  it('should fail to login because of incorrect password', () => {
    cy.get('.m-v2-topbar__Container__LoginWrapper > a').contains('Login').click();

    cy.location('pathname').should('eq', '/login');

    // cy.get('.m-login__wrapper').should('be.visible');

    // type username and password
    cy.get('minds-form-login .m-login-box .mdl-cell:first-child input')
      .type(Cypress.env().username);
    cy.get('minds-form-login .m-login-box .mdl-cell:last-child input')
      .type(Cypress.env().password + '1'); // invalid

    // click login button
    cy.get('button')
      .contains('Login')
      .click();

    cy.get('minds-form-login .m-error-box .mdl-card__supporting-text')
      .contains('Incorrect username/password. Please try again.');
  })
})
