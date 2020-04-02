context('Rewards Product Page', () => {
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

  const joinRewards = '.m-marketing__mainWrapper .mf-button';

  it('should have a join rewards button', () => {
    cy.visit('/rewards');

    cy.get(joinRewards)
      .should('be.visible')
      .should('contain', 'Join Rewards')
      .click();

    cy.location('pathname').should(
      'contains',
      '/wallet/tokens/contributions'
    );
  });
});
