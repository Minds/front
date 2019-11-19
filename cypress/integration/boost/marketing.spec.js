context('Boost Product Page', () => {
  before(() => {
    cy.getCookie('minds_sess').then(sessionCookie => {
      if (!sessionCookie) {
        return cy.login(true);
      }
    });
  });

  beforeEach(() => {
    cy.preserveCookies();
  });

  const createBoostButton = '.m-marketing__mainWrapper .mf-button';

  it('should have a create boost button', () => {
    cy.visit('/boost');

    cy.get(createBoostButton)
      .should('be.visible')
      .should('contain', 'Create Boost')
      .click();

    cy.location('pathname').should(
      'contains',
      '/boost/console/newsfeed/create'
    );
  });
});
