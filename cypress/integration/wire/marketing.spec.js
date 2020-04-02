context('Pay Product Page', () => {
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

  const monetizeChannelButton = '.m-marketing__mainWrapper .mf-button';

  it('should have a monetize channel button', () => {
    cy.visit('/pay');

    cy.get(monetizeChannelButton)
      .should('be.visible')
      .should('contain', 'Monetize your channel')
      .click();

    cy.location('pathname').should(
      'contains',
      '/wallet/tokens/contributions'
    );
  });
});
